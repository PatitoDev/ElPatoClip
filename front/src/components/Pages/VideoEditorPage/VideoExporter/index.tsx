import * as S from './styles';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Layer, TimeSlice } from '../../../../types';
import { useVideo } from '../useVideo';
import { useRenderLoop } from '../../../../hooks/useRenderLoop';
import { VideoCanvas } from '../../../Molecules/Editor/VideoCanvas';
import { Button } from '../../../Atoms/Button';
import { useCanvasRecording } from './useCanvasRecording';
import { useEventListener } from '../../../../hooks/useEventListener';
import { TiktokApi } from '../../../../api/tiktokApi';
import { ElPatoApi } from '../../../../api/elPatoClipApi';
import { useAuth } from '../../../../authContext/useAuth';

export interface VideoExporterProps {
  videoUrl: string,
  layers: Array<Layer>,
  timeSlice: TimeSlice
}

export const VideoExporter = ({
  layers,
  timeSlice,
  videoUrl
}: VideoExporterProps) => {
  const auth = useAuth();
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { seekTo, setPlayback } = useVideo(videoRef, timeSlice);

  const { outputUrl, record } = useCanvasRecording(outputCanvasRef, videoRef);

  useEventListener<HTMLVideoElement, Event>(videoRef, 'loadeddata', () => {
    seekTo(timeSlice.startTime);
    setPlayback(true);
    const videoDuration = timeSlice.endTime - timeSlice.startTime;
    record(videoDuration * 1000);
  });

  useRenderLoop(useCallback(() => {
    if (!videoRef.current) return;
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
  }, []));

  const download = useCallback((blobUrl: string) => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = blobUrl;
    a.download = 'test.webm';
    a.click();
  }, []);

  useEffect(() => {
    if (!outputUrl) return;
    setPlayback(false);
  }, [outputUrl, setPlayback]);

  const renderLayers: Array<Layer> = useMemo(() => layers.map((item) => ({
    ...item,
    locked: true,
    output: item.output,
    input: item.input
  })), [layers]);

  const upload = useCallback(async () => {
    if (!outputUrl) return;
    if (!auth) return;
    console.log('uploading...');
    const videoBlob = await (await fetch(outputUrl)).blob();
    // todo - break it into chunks correctly
    const chunkAmount = 1; // Math.ceil(videoBlob.size / 6000000);
    const chunkSize = videoBlob.size;//Math.ceil(videoBlob.size / chunkAmount);

    console.log({
      size: videoBlob.size,
      chunkSize,
      chunkAmount
    });

    const videoContainerUrl = await ElPatoApi.initiateVideo({
      post_info: {
        brand_content_toggle: false,
        brand_organic_toggle: false,
        disable_comment: true,
        disable_duet: true,
        disable_stitch: true,
        privacy_level: 'SELF_ONLY',
        title: 'Pato intenta explicar lo que hace',
        video_cover_timestamp_ms: 100
      }, 
      source_info: {
        chunk_size: chunkSize,
        video_size: videoBlob.size,
        source: 'FILE_UPLOAD',
        total_chunk_count: chunkAmount
      }
    }, auth.token);

    if (!videoContainerUrl) {
      console.error('something has gone wrong creating video container');
      return;
    }

    for (let i = 0; i < chunkAmount; i++) {
      console.log('uploading one chunk'); 
      const start = i * chunkSize;
      const data = videoBlob.slice(start, Math.min(start + chunkSize, videoBlob.size));
      await TiktokApi.uploadVideoChunk(videoContainerUrl.upload_url, data.size, start, videoBlob.size, data);
    }

    console.log(videoContainerUrl);
    setInterval(async () => {
      const resp = await ElPatoApi.getVideoStatus(videoContainerUrl.publish_id, auth.token);
      console.log(resp);
    }, 10000);

  }, [auth, outputUrl]);

  return (
    <S.Container>
      <S.VideoContainer>
        {outputUrl ? (
          <video controls src={outputUrl} />
        ) : (
          <VideoCanvas
            withPadding={false}
            ref={outputCanvasRef}
            direction='portrait'
            hoverLayerId={null}
            selectedLayerId={null}
            setHoverLayerId={() => {}}
            setSelectedLayerId={() => {}}
            layers={renderLayers}
            videoRef={canvasRef}
          />
        )}
      </S.VideoContainer>
      <canvas hidden ref={canvasRef} width={1920} height={1080} />
      <video hidden ref={videoRef} src={videoUrl} width={1920} height={1080} />
      { outputUrl ?

        <div>
          <Button theme='light' onClick={() => download(outputUrl)}>Download</Button>
          <Button theme='light' onClick={upload}>Upload</Button>
        </div>
        : 
        <h2>Rendering...</h2>
      }
    </S.Container>
  );
};