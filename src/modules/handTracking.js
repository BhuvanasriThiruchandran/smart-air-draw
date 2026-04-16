// Using global MediaPipe from CDN
const getHandsConstructor = () => {
  if (typeof window !== 'undefined' && window.Hands) return window.Hands;
  return null;
};

export class HandTracker {
  constructor(onResults) {
    const HandsConstructor = getHandsConstructor();
    if (!HandsConstructor) {
      console.error('MediaPipe Hands not found.');
      throw new Error('MediaPipe Hands not found');
    }

    this.hands = new HandsConstructor({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,   // 🔥 increased
      minTrackingConfidence: 0.7,    // 🔥 increased
    });

    this.hands.onResults((results) => {
      // 🔥 IMPORTANT FIX → ignore noise
      if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        return;
      }

      onResults(results);
    });
  }

  async send(image) {
    await this.hands.send({ image });
  }

  static getLandmark(results, index) {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      return results.multiHandLandmarks[0][index];
    }
    return null;
  }

  static isFingerUp(landmarks, fingerIndex) {
    const tip = landmarks[fingerIndex * 4 + 4];
    const pip = landmarks[fingerIndex * 4 + 2];
    return tip.y < pip.y;
  }
}