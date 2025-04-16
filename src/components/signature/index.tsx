import { AddToAttrs } from "aio-utils";
import { useEffect, useRef, useState } from "react";
import './index.css';
export const Signature: React.FC<{
    attrs?: React.HTMLAttributes<HTMLCanvasElement>;
    onSave?: (file: any) => void;
}> = ({ attrs = {}, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current!;
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000';
            ctxRef.current = ctx;
        }
    }, []);

    const getPos = (e: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            const t = e.touches[0];
            return { x: t.clientX - rect.left, y: t.clientY - rect.top };
        }

        return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    };

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const pos = getPos(e.nativeEvent);
        ctxRef.current?.beginPath();
        ctxRef.current?.moveTo(pos.x, pos.y);
        setDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing) return;
        const pos = getPos(e.nativeEvent);
        ctxRef.current?.lineTo(pos.x, pos.y);
        ctxRef.current?.stroke();
    };

    const endDraw = () => {
        setDrawing(false);
        ctxRef.current?.closePath();
    };

    const clear = () => {
        const canvas = canvasRef.current!;
        ctxRef.current?.clearRect(0, 0, canvas.width, canvas.height);
    };

    const save = () => {
        const canvas = canvasRef.current!;
        canvas.toBlob((blob) => {
            if (blob && onSave) {
                const file: any = new File([blob], 'signature.png', { type: 'image/png' });
                onSave(file);
            }
        }, 'image/png');
    };
    const Attrs = AddToAttrs(attrs, { className: 'ai-signature' })
    return (
        <div {...Attrs}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
            />
            <div className='ai-signature-footer'>
                <button className='ai-signature-save' onClick={save}>ذخیره</button>
                <button className='ai-signature-clear' onClick={clear}>پاک کردن</button>
            </div>
        </div>
    );
};

