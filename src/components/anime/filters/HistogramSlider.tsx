import React, { useMemo, useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface HistogramSliderProps {
    label: string;
    data: number[]; // Array of counts for each step
    range: [number, number]; // [minVal, maxVal]
    value: [number, number]; // [currentMin, currentMax]
    onChange: (newValue: [number, number]) => void;
    step?: number;
}

export const HistogramSlider: React.FC<HistogramSliderProps> = ({
    label,
    data,
    range,
    value,
    onChange,
    step = 1
}) => {
    const [min, max] = range;
    const [start, end] = value;
    const containerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState<'start' | 'end' | null>(null);

    // Calculate histogram data density for visual bars
    const maxCount = useMemo(() => Math.max(...data, 1), [data]);

    const translateValueToPos = (val: number) => {
        const percent = ((val - min) / (max - min)) * 100;
        return Math.min(Math.max(percent, 0), 100);
    };

    const translatePosToValue = React.useCallback((posPercent: number) => {
        const val = min + (posPercent / 100) * (max - min);
        const rounded = Math.round(val / step) * step;
        return Math.min(Math.max(rounded, min), max);
    }, [min, max, step]);

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        if (!dragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const posPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const newVal = translatePosToValue(posPercent);

        if (dragging === 'start') {
            onChange([Math.min(newVal, end - step), end]);
        } else {
            onChange([start, Math.max(newVal, start + step)]);
        }
    }, [dragging, start, end, step, translatePosToValue, onChange]);

    const handleMouseUp = React.useCallback(() => setDragging(null), []);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, handleMouseMove, handleMouseUp]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-secondary-muted uppercase tracking-wider">{label}</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={start}
                        onChange={(e) => onChange([parseInt(e.target.value) || min, end])}
                        className="w-16 bg-secondary-muted/10 border border-transparent rounded-lg py-1 px-2 text-sm font-bold text-center text-bg-dark focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                    <span className="text-secondary-muted font-black">—</span>
                    <input
                        type="number"
                        value={end}
                        onChange={(e) => onChange([start, parseInt(e.target.value) || max])}
                        className="w-16 bg-secondary-muted/10 border border-transparent rounded-lg py-1 px-2 text-sm font-bold text-center text-bg-dark focus:border-accent/40 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="relative h-24 pt-8 group" ref={containerRef}>
                {/* Histogram Bars */}
                <div className="absolute inset-x-0 bottom-6 h-12 flex items-end justify-between gap-[2px]">
                    {data.map((count, i) => {
                        const val = min + (i / (data.length - 1)) * (max - min);
                        const isInRange = val >= start && val <= end;
                        const height = (count / maxCount) * 100;

                        return (
                            <div
                                key={i}
                                className={cn(
                                    "flex-1 bg-secondary-muted/20 transition-all duration-300 rounded-t-sm",
                                    !isInRange && "opacity-40 scale-y-75",
                                    isInRange && "bg-accent/80 scale-y-100 opacity-100"
                                )}
                                style={{ height: `${height}%` }}
                            />
                        );
                    })}
                </div>

                {/* Slider Track */}
                <div className="absolute bottom-2 inset-x-0 h-1 bg-secondary-muted/20">
                    <div
                        className="absolute h-full bg-accent rounded-full shadow-sm"
                        style={{
                            left: `${translateValueToPos(start)}%`,
                            right: `${100 - translateValueToPos(end)}%`
                        }}
                    />
                </div>

                {/* Handles */}
                <button
                    type="button"
                    onMouseDown={() => setDragging('start')}
                    className="absolute bottom-2 -translate-x-1/2 -translate-y-[calc(50%-2px)] w-5 h-5 rounded-full bg-white border border-secondary-muted/30 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform outline-none focus:ring-2 focus:ring-accent/40"
                    style={{ left: `${translateValueToPos(start)}%` }}
                />

                <button
                    type="button"
                    onMouseDown={() => setDragging('end')}
                    className="absolute bottom-2 -translate-x-1/2 -translate-y-[calc(50%-2px)] w-5 h-5 rounded-full bg-white border border-secondary-muted/30 shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform outline-none focus:ring-2 focus:ring-accent/40"
                    style={{ left: `${translateValueToPos(end)}%` }}
                />
            </div>
        </div>
    );
};
