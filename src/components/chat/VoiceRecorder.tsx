
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mic, MicOff, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = handleRecordingStop;
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started...");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.info("Recording stopped. Processing audio...");
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
        toast.success("Audio transcribed successfully!");
      };
    } catch (err) {
      console.error("Error processing audio:", err);
      setIsProcessing(false);
      toast.error("Failed to process audio. Please try again.");
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

  return (
    <div className="flex flex-col space-y-4">
      <DialogHeader>
        <DialogTitle>Voice Message</DialogTitle>
        <DialogDescription>
          Record a voice message to send to HelloClari
        </DialogDescription>
      </DialogHeader>

      {transcript ? (
        <div className="flex flex-col space-y-2">
          <Textarea
            value={transcript}
            onChange={handleTranscriptChange}
            className="resize-none"
            placeholder="Transcribed text will appear here..."
            rows={4}
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setTranscript('')}
            >
              Clear
            </Button>
            <Button
              onClick={handleSendTranscript}
              disabled={!transcript.trim()}
            >
              <Send className="h-4 w-4 mr-2" /> Send
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="mb-6 text-center">
            {isProcessing ? (
              <p className="text-muted-foreground animate-pulse">Processing your audio...</p>
            ) : isRecording ? (
              <p className="text-primary font-medium">Recording... Speak now</p>
            ) : (
              <p className="text-muted-foreground">Click the microphone to start recording</p>
            )}
          </div>
          
          <Button
            type="button"
            variant={isRecording ? "destructive" : "default"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled || isProcessing}
            className="rounded-full h-16 w-16"
            size="icon"
          >
            {isRecording ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
