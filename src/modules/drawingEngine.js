import { TransformEngine } from './transformEngine';

export class DrawingEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * @param {Array} strokes - All committed strokes from StrokeManager
   * @param {Object|null} currentPath - The in-progress drawing path
   * @param {number|null} selectedStrokeId - ID of stroke selected by control hand
   * @param {string} controlGesture - Current control gesture for visual guides
   */
  draw(strokes, currentPath = null, selectedStrokeId = null, controlGesture = 'CTRL_IDLE') {
    this.clearCanvas();
    const ctx = this.ctx;

    const allStrokes = [...strokes];
    if (currentPath) allStrokes.push(currentPath);

    allStrokes.forEach((stroke) => {
      if (!stroke.points || stroke.points.length === 0) return;

      const points = stroke.transform
        ? TransformEngine.getTransformedPoints(stroke)
        : stroke.points;

      if (points.length < 1) return;

      const isSelected = selectedStrokeId !== null && stroke.id === selectedStrokeId;

      ctx.save();
      ctx.beginPath();

      if (points.length === 1) {
        ctx.arc(points[0].x, points[0].y, stroke.lineWidth / 2, 0, 2 * Math.PI);
        ctx.fillStyle = isSelected ? '#ffffff' : stroke.color;
        ctx.fill();
        ctx.restore();
        return;
      }

      ctx.moveTo(points[0].x, points[0].y);

      if (points.length === 2) {
        const smoothX = points[0].x * 0.7 + points[1].x * 0.3;
        const smoothY = points[0].y * 0.7 + points[1].y * 0.3;
        ctx.lineTo(smoothX, smoothY);
      } else {
        for (let i = 1; i < points.length - 1; i++) {
          const current = points[i];
          const next = points[i + 1];

          const midX = (current.x + next.x) / 2;
          const midY = (current.y + next.y) / 2;

          ctx.quadraticCurveTo(current.x, current.y, midX, midY);
        }

        const secondLast = points[points.length - 2];
        const last = points[points.length - 1];
        ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);
      }

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.lineWidth * (stroke.transform?.scale || 1);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (isSelected) {
        ctx.shadowBlur = (stroke.glowIntensity || 15) * 2.5;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = '#ffffff';
      } else {
        ctx.shadowBlur = stroke.glowIntensity || 0;
        ctx.shadowColor = stroke.color;
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      if (isSelected) {
        this._drawSelectionGuides(ctx, points, stroke, controlGesture);
      }

      ctx.restore();
    });
  }

  /**
   * Draw visual guides around a selected stroke.
   */
  _drawSelectionGuides(ctx, points, stroke, controlGesture) {
    let cx = 0, cy = 0;
    for (const p of points) {
      cx += p.x;
      cy += p.y;
    }
    cx /= points.length;
    cy /= points.length;

    let maxR = 0;
    for (const p of points) {
      const d = Math.sqrt((p.x - cx) ** 2 + (p.y - cy) ** 2);
      if (d > maxR) maxR = d;
    }
    const guideRadius = maxR + 20;

    ctx.save();

    ctx.beginPath();
    ctx.arc(cx, cy, guideRadius, 0, 2 * Math.PI);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    if (controlGesture === 'CTRL_ROTATE') {
      const angle = stroke.transform?.rotation || 0;
      ctx.beginPath();
      ctx.arc(cx, cy, guideRadius + 8, -Math.PI / 2, -Math.PI / 2 + angle, angle < 0);
      ctx.strokeStyle = 'rgba(255, 165, 0, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();

      const endAngle = -Math.PI / 2 + angle;
      const ax = cx + (guideRadius + 8) * Math.cos(endAngle);
      const ay = cy + (guideRadius + 8) * Math.sin(endAngle);

      ctx.beginPath();
      ctx.arc(ax, ay, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 165, 0, 0.9)';
      ctx.fill();
    } else if (controlGesture === 'CTRL_SCALE') {
      const scale = stroke.transform?.scale || 1;

      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, guideRadius * (0.5 + i * 0.2), 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(0, 255, 200, ${0.15 * (4 - i)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 255, 200, 0.8)';
      ctx.font = '12px monospace';
      ctx.fillText(`${(scale * 100).toFixed(0)}%`, cx - 15, cy - guideRadius - 12);
    } else if (controlGesture === 'CTRL_MOVE') {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(100, 180, 255, 0.6)';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - 12, cy);
      ctx.lineTo(cx + 12, cy);
      ctx.moveTo(cx, cy - 12);
      ctx.lineTo(cx, cy + 12);
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  saveAsImage() {
    return this.canvas.toDataURL('image/png');
  }
}