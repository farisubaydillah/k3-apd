import { ApdItem, ApdKey, DetectionResponse, BoundingBox } from '../types/k3';
import { DEFAULT_APD_ITEMS } from '../data/mockData';

export type DetectionScenario = 'all_complete' | 'missing_helmet' | 'missing_shoes' | 'missing_vest' | 'only_mandatory';
export type DemoScenario = DetectionScenario;

export interface DetectionOptions {
  mode: 'mock' | 'yolo_api';
  scenario?: DetectionScenario;
  yoloApiUrl?: string;
  imageElement?: HTMLImageElement | null;
}

/**
 * Simulasi Deteksi APD K3
 */
export function detectApdMock(scenario: DetectionScenario = 'all_complete'): { items: ApdItem[] } {
  const items = DEFAULT_APD_ITEMS.map((item) => {
    let isDetected = false;
    let confidence = 50;
    let bbox = item.bbox;

    switch (scenario) {
      case 'all_complete':
        isDetected = true;
        confidence = Math.floor(92 + Math.random() * 7);
        bbox = item.bbox;
        break;

      case 'missing_helmet':
        if (item.key === 'helmet') {
          isDetected = false;
          confidence = Math.floor(12 + Math.random() * 15);
          bbox = undefined;
        } else {
          isDetected = true;
          confidence = Math.floor(90 + Math.random() * 8);
          bbox = item.bbox;
        }
        break;

      case 'missing_shoes':
        if (item.key === 'shoes') {
          isDetected = false;
          confidence = Math.floor(15 + Math.random() * 10);
          bbox = undefined;
        } else {
          isDetected = true;
          confidence = Math.floor(89 + Math.random() * 9);
          bbox = item.bbox;
        }
        break;

      case 'missing_vest':
        if (item.key === 'vest') {
          isDetected = false;
          confidence = Math.floor(10 + Math.random() * 14);
          bbox = undefined;
        } else {
          isDetected = true;
          confidence = Math.floor(90 + Math.random() * 8);
          bbox = item.bbox;
        }
        break;

      case 'only_mandatory':
        if (item.isMandatory) {
          isDetected = true;
          confidence = Math.floor(90 + Math.random() * 8);
          bbox = item.bbox;
        } else {
          isDetected = false;
          confidence = Math.floor(20 + Math.random() * 15);
          bbox = undefined;
        }
        break;
    }

    return {
      ...item,
      detected: isDetected,
      confidence,
      bbox,
    };
  });

  return { items };
}

/**
 * Async detection function supporting both mock and external YOLO endpoint
 */
export async function detectApdFromImage(
  imageDataUrl: string,
  options: DetectionOptions = { mode: 'mock', scenario: 'all_complete' }
): Promise<{
  detections: ApdItem[];
  modelUsed: string;
  inferenceTimeMs: number;
  allMandatoryDetected: boolean;
}> {
  const startTime = performance.now();

  if (options.mode === 'yolo_api' && options.yoloApiUrl) {
    try {
      const response = await fetch(options.yoloApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl }),
      });

      if (response.ok) {
        const json: DetectionResponse = await response.json();
        const endTime = performance.now();

        const detections = DEFAULT_APD_ITEMS.map((item) => {
          const matched = json.detections.find((d) => d.class === item.key);
          if (matched && matched.confidence >= 0.5) {
            return {
              ...item,
              detected: true,
              confidence: Math.round(matched.confidence * 100),
              bbox: matched.bbox || item.bbox,
            };
          }
          return {
            ...item,
            detected: false,
            confidence: matched ? Math.round(matched.confidence * 100) : Math.floor(10 + Math.random() * 20),
            bbox: undefined,
          };
        });

        const allMandatoryDetected = detections
          .filter((d) => d.isMandatory)
          .every((d) => d.detected);

        return {
          detections,
          modelUsed: 'YOLOv8 Custom APD Model (Ultralytics Inference)',
          inferenceTimeMs: Math.round(endTime - startTime),
          allMandatoryDetected,
        };
      }
    } catch {
      // fallback to mock
    }
  }

  const { items } = detectApdMock(options.scenario || 'all_complete');
  const endTime = performance.now();
  const allMandatoryDetected = items
    .filter((d) => d.isMandatory)
    .every((d) => d.detected);

  return {
    detections: items,
    modelUsed: 'YOLOv8n-K3-Architecture (Simulated Edge Inference)',
    inferenceTimeMs: Math.round(endTime - startTime),
    allMandatoryDetected,
  };
}
