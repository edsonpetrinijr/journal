import { useRef, useState, useEffect } from "react";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void;
  isRecording: boolean;
  hasRecording: boolean;
  recordingDuration: number;
  onDelete: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export function VoiceRecorder({
  onRecordingComplete,
  isRecording,
  hasRecording,
  recordingDuration,
  onDelete,
  onStartRecording,
  onStopRecording,
}: VoiceRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Volume animation state
  const [volume, setVolume] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const cleanupAudio = () => {
    // Stop all tracks in the current stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        console.log("Track stopped:", track.kind);
      });
      streamRef.current = null;
    }

    // Clean up audio context
    if (audioContextRef.current) {
      if (audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(console.error);
      }
      audioContextRef.current = null;
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    analyserRef.current = null;
    setVolume(0);
  };

  const updateVolume = () => {
    if (analyserRef.current && isRecording) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      setVolume(avg);
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    } else {
      setVolume(0);
      animationFrameRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isStarting || isRecording) return;

    try {
      setIsStarting(true);
      setError(null);

      // Clean up any existing state just in case
      cleanupAudio();

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      // Setup Audio Analyzer for volume
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const supportedTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
        "audio/aac",
      ];

      let mimeType = "";
      for (const type of supportedTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }

      console.log("Using MIME type:", mimeType);

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = url;
        }

        onRecordingComplete(audioBlob, recordingDuration);
        cleanupAudio();
      };

      mediaRecorder.start(200); // Collect data every 200ms

      if (onStartRecording) onStartRecording();

      // Start volume animation after isRecording should be true from parent
      // We use a small timeout to ensure state has propagated
      setTimeout(() => {
        updateVolume();
      }, 50);

    } catch (err: any) {
      setError("Failed to access microphone. Please check permissions.");
      console.error("Recording error:", err);
      cleanupAudio();
    } finally {
      setIsStarting(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      if (onStopRecording) onStopRecording();
    } else {
      // Fallback cleanup if recorder is already inactive but UI thinks it's recording
      cleanupAudio();
      if (onStopRecording) onStopRecording();
    }
  };

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  // Calculate dynamic scale based on volume (0 to ~255)
  // Base scale 1, max scale ~2.5
  const rippleScale = 1 + (volume / 255) * 1.5;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-6">
        {/* Recording Button with Dynamic Ripple Background */}
        <div className="relative flex items-center justify-center">
          {/* Animated Background Circle */}
          {isRecording && (
            <div
              className="absolute w-24 h-24 bg-red-500 rounded-full opacity-30 pointer-events-none"
              style={{
                transform: `scale(${rippleScale})`,
                transition: "transform 0.05s ease-out",
              }}
            />
          )}

          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={(hasRecording && !isRecording) || isStarting}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold transition-all transform hover:scale-105 active:scale-95 ${isRecording
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-primary hover:bg-primary/90 text-white shadow-lg"
              } ${(hasRecording && !isRecording) || isStarting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isStarting ? "⌛" : isRecording ? "⏹" : "🎤"}
          </button>
        </div>

        {/* Timer */}
        {(isRecording || (hasRecording && recordingDuration > 0)) && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-3xl font-mono font-bold text-primary">
              {formatTime(recordingDuration)}
            </div>
            {isRecording && (
              <div className="flex gap-1 h-6 items-center">
                {[1, 2, 3, 4, 5].map((i) => {
                  // A simple equalizer effect driven by the overall volume
                  const height = Math.max(4, (volume / 255) * 24 * (0.5 + Math.random() * 0.5));
                  return (
                    <div
                      key={i}
                      className="w-1 bg-red-500 rounded-full transition-all duration-75"
                      style={{ height: `${height}px` }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Error message */}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Audio player */}
        {hasRecording && !isRecording && (
          <div className="w-full max-w-sm space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Recording saved</span>
              <span className="text-xs text-muted-foreground">
                {formatTime(recordingDuration)}
              </span>
            </div>
            <audio
              ref={audioRef}
              controls
              className="w-full h-8"
              style={{
                colorScheme: "light",
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onDelete}
                className="flex-1 px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={startRecording}
                className="flex-1 px-3 py-2 text-sm bg-secondary hover:bg-secondary/90 text-foreground rounded-lg transition-colors"
              >
                Re-record
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
