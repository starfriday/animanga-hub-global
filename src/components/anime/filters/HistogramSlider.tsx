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

    const translatePosToValue = (posPercent: number) => {
        const val = min + (posPercent / 100) * (max - min);
        const rounded = Math.round(val / step) * step;
        return Math.min(Math.max(rounded, min), max);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const posPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const newVal = translatePosToValue(posPercent);

        if (dragging === 'start') {
            onChange([Math.min(newVal, end - step), end]);
        } else {
            onChange([start, Math.max(newVal, start + step)]);
        }
    };

    const handleMouseUp = () => setDragging(null);

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, start, end]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-bg-dark uppercase tracking-widest flex items-center gap-2"><span className="w-2 h-2 bg-accent inline-block rounded-sm"></span>{label}</label>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        value={start}
                        onChange={(e) => onChange([parseInt(e.target.value) || min, end])}
                        className="w-14 bg-white border-2 border-bg-dark py-1.5 px-2 text-[10px] font-bold text-center text-bg-dark focus:border-accent outline-none shadow-[2px_2px_0_var(--color-bg-dark)] transition-all"
                    />
                    <span className="text-bg-dark/30 font-black">—</span>
                    <input
                        type="number"
                        value={end}
                        onChange={(e) => onChange([start, parseInt(e.target.value) || max])}
                        className="w-14 bg-white border-2 border-bg-dark py-1.5 px-2 text-[10px] font-bold text-center text-bg-dark focus:border-accent outline-none shadow-[2px_2px_0_var(--color-bg-dark)] transition-all"
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
                                    "flex-1 bg-bg-dark/20 transition-all duration-300",
                                    !isInRange && "opacity-30 scale-y-75",
                                    isInRange && "bg-accent scale-y-100 opacity-100 border border-bg-dark"
                                )}
                                style={{ height: `${height}%` }}
                            />
                        );
                    })}
                </div>

                {/* Slider Track */}
                <div className="absolute bottom-2 inset-x-0 h-1 bg-bg-dark/10">
                    <div
                        className="absolute h-full bg-accent border-y border-bg-dark shadow-[0_2px_0_var(--color-bg-dark)]"
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
                    className="absolute bottom-2 -translate-x-1/2 -translate-y-[calc(50%-1px)] w-4 h-4 bg-white border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] cursor-grab active:cursor-grabbing hover:bg-bg-dark transition-colors outline-none hover:shadow-none active:translate-y-0.5 active:translate-x-0.5"
                    style={{ left: `${translateValueToPos(start)}%` }}
                />

                <button
                    type="button"
                    onMouseDown={() => setDragging('end')}
                    className="absolute bottom-2 -translate-x-1/2 -translate-y-[calc(50%-1px)] w-4 h-4 bg-white border-2 border-bg-dark shadow-[2px_2px_0_var(--color-bg-dark)] cursor-grab active:cursor-grabbing hover:bg-bg-dark transition-colors outline-none hover:shadow-none active:translate-y-0.5 active:translate-x-0.5"
                    style={{ left: `${translateValueToPos(end)}%` }}
                />
            </div>
        </div>
    );
};
