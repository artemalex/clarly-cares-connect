
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mic, MicOff, Send, X, RotateCcw, Check, AudioWaveform } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface VoiceRecorderProps {
  onTranscriptSend: (text: string) => void;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptSend,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Array of bar heights for the waveform visualization
  const [waveformBars, setWaveformBars] = useState<number[]>(Array(30).fill(2));

  // Start recording automatically when component mounts
  useEffect(() => {
    if (!disabled) {
      startRecording();
    }
    
    // Clean up animation frame and recording on component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const updateAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    const normalizedLevel = Math.min(1, average / 128); // Normalize between 0 and 1
    
    setAudioLevel(normalizedLevel);

    // Update waveform bars with smoothing
    setWaveformBars(prevBars => {
      // Create a new array with updated heights
      return prevBars.map((height, index) => {
        // Generate random height influenced by audio level
        const targetHeight = normalizedLevel * 24 * (0.2 + Math.random() * 0.8);
        // Apply smoothing - move 30% toward the target height
        return height + (targetHeight - height) * 0.3;
      });
    });
    
    // Detect silence (to auto-stop recording after 10 seconds)
    if (isRecording) {
      if (normalizedLevel < 0.05) { // Very low audio level
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = window.setTimeout(() => {
            stopRecording();
          }, 10000); // 10 seconds of silence
        }
      } else {
        // Reset silence timeout if sound is detected
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }
    }
    
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up audio analyzer for visualizing sound levels
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start monitoring audio levels
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
      
      toast.info("Listening...", { duration: 2000 });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    // Clear the silence detection timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    
    // Cancel the animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleRecordingStop = async () => {
    try {
      setIsProcessing(true);
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error("Failed to convert audio to base64");
        }
        
        // Send to our transcription function
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio }
        });
        
        if (error) {
          throw error;
        }
        
        setTranscript(data.text);
        setIsProcessing(false);
      };
    } catch (err) {
      console.error("Error processing audio:", err);
      setIsProcessing(false);
      toast.error("I didn't quite catch that. Would you like to try again?");
    }
  };

  const handleSendTranscript = () => {
    if (transcript.trim()) {
      onTranscriptSend(transcript);
      setTranscript('');
    }
  };

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  const resetRecording = () => {
    setTranscript('');
    setIsProcessing(false);
  };

  // Generate points for the audio waveform visualization
  const generateWaveformPoints = () => {
    const points = [];
    const numPoints = 10;
    const width = 200;
    const height = 50;
    const centerY = height / 2;
    
    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * width;
      // Use the audio level to determine the amplitude of the waveform
      const amplitude = audioLevel * 20;
      // Create a sine wave for visualization
      const y = centerY + Math.sin(i * 0.5 + Date.now() * 0.005) * amplitude;
      points.push(`${x},${y}`);
    }
    
    return points.join(' ');
  };

  return (
    <div className="flex flex-col space-y-4">
      <DialogHeader>
        <DialogTitle>Voice Message</DialogTitle>
        <DialogDescription>
          Speak naturally to HelloClari
        </DialogDescription>
      </DialogHeader>

      {transcript ? (
        <div className="flex flex-col space-y-2 animate-fade-in">
          <div className="bg-muted p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Review your message:</h3>
            <Textarea
              value={transcript}
              onChange={handleTranscriptChange}
              className="resize-none bg-background"
              placeholder="Your transcribed message will appear here..."
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetRecording}
              className="gap-1"
            >
              <RotateCcw className="h-4 w-4" /> Retry
            </Button>
            <Button
              onClick={handleSendTranscript}
              disabled={!transcript.trim()}
              className="gap-1"
            >
              <Send className="h-4 w-4" /> Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <div className={cn(
            "mb-6 text-center transition-opacity duration-300",
            isProcessing && "animate-pulse"
          )}>
            {isProcessing ? (
              <p className="text-muted-foreground">Processing your audio...</p>
            ) : isRecording ? (
              <p className="text-primary font-medium">Recording... speak freely</p>
            ) : (
              <p className="text-muted-foreground">Starting recording...</p>
            )}
          </div>
          
          {/* New ChatGPT-style waveform animation */}
          {isRecording && (
            <div className="relative mb-6 flex items-center justify-center h-20 w-64">
              <div className="flex items-end space-x-1 h-16">
                {waveformBars.map((height, index) => (
                  <div
                    key={index}
                    className="w-1.5 bg-primary rounded-full transition-all duration-100 ease-in-out"
                    style={{ 
                      height: `${Math.max(2, height)}px`,
                      opacity: isRecording ? 0.7 + (height / 40) : 0.5
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
          
          <div className="relative">
            <Button
              type="button"
              variant={isRecording ? "destructive" : "default"}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={disabled || isProcessing}
              className={cn(
                "rounded-full h-16 w-16 transition-all duration-300",
                isRecording && "animate-pulse"
              )}
              size="icon"
            >
              {isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
            
            {isRecording && (
              <Button 
                variant="outline"
                size="icon"
                onClick={stopRecording}
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isRecording && (
            <p className="text-xs text-muted-foreground mt-4">
              Will auto-stop after 10 seconds of silence
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;

