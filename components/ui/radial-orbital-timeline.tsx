"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((key) => { newState[parseInt(key)] = false; });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.25) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.35, Math.min(1, 0.35 + 0.65 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, angle, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const current = timelineData.find((item) => item.id === itemId);
    return current ? current.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":   return "text-background bg-primary border-primary";
      case "in-progress": return "text-primary bg-primary/10 border-primary/60";
      case "pending":     return "text-muted-foreground bg-muted border-border";
      default:            return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div
      className="w-full h-[560px] flex flex-col items-center justify-center overflow-hidden relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div
        className="relative w-full max-w-4xl h-full flex items-center justify-center"
        ref={orbitRef}
        style={{ perspective: "1000px", transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)` }}
      >
        {/* Center orb */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary via-cyan-300 to-accent animate-pulse flex items-center justify-center z-10 shadow-[0_0_40px_rgba(34,211,238,0.5)]">
          <div className="absolute w-20 h-20 rounded-full border border-primary/30 animate-ping opacity-60" />
          <div className="absolute w-28 h-28 rounded-full border border-primary/15 animate-ping opacity-40" style={{ animationDelay: "0.6s" }} />
          <div className="w-7 h-7 rounded-full bg-background/90 backdrop-blur-md" />
        </div>

        {/* Orbit ring */}
        <div className="absolute w-[416px] h-[416px] rounded-full border border-primary/12" />
        <div className="absolute w-[412px] h-[412px] rounded-full border border-primary/6 scale-105" />

        {/* Nodes */}
        {timelineData.map((item, index) => {
          const position = calculateNodePosition(index, timelineData.length);
          const isExpanded = expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = pulseEffect[item.id];
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              ref={(el) => (nodeRefs.current[item.id] = el)}
              className="absolute transition-all duration-700 cursor-pointer"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
              }}
              onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
            >
              {/* Energy aura */}
              <div
                className={`absolute rounded-full ${isPulsing ? "animate-pulse" : ""}`}
                style={{
                  background: "radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0) 70%)",
                  width: `${item.energy * 0.45 + 40}px`,
                  height: `${item.energy * 0.45 + 40}px`,
                  left: `-${(item.energy * 0.45 + 40 - 40) / 2}px`,
                  top: `-${(item.energy * 0.45 + 40 - 40) / 2}px`,
                }}
              />

              {/* Node icon */}
              <div
                className={[
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isExpanded
                    ? "bg-primary text-background border-primary shadow-[0_0_20px_rgba(34,211,238,0.7)] scale-150"
                    : isRelated
                    ? "bg-primary/20 text-primary border-primary animate-pulse"
                    : "bg-background/80 text-primary border-primary/40 hover:border-primary/80",
                ].join(" ")}
              >
                <Icon size={15} />
              </div>

              {/* Label */}
              <div
                className={[
                  "absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300",
                  isExpanded ? "text-primary scale-110" : "text-foreground/70",
                ].join(" ")}
              >
                {item.title}
              </div>

              {/* Expanded card */}
              {isExpanded && (
                <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-background/90 backdrop-blur-xl border-primary/30 shadow-[0_8px_32px_rgba(34,211,238,0.15)] overflow-visible">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-primary/50" />
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between items-center">
                      <Badge className={`px-2 text-[10px] uppercase tracking-wider border ${getStatusStyles(item.status)}`}>
                        {item.status === "completed" ? "Live" : item.status === "in-progress" ? "Processing" : "Queued"}
                      </Badge>
                      <span className="text-[10px] font-mono text-muted-foreground">{item.date}</span>
                    </div>
                    <CardTitle className="text-sm mt-2 text-foreground">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground px-4 pb-4">
                    <p className="leading-relaxed">{item.content}</p>
                    <div className="mt-4 pt-3 border-t border-border">
                      <div className="flex justify-between items-center text-[10px] mb-1.5">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Zap size={9} className="text-primary" /> Agent power
                        </span>
                        <span className="font-mono text-primary">{item.energy}%</span>
                      </div>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-cyan-300 rounded-full transition-all duration-500"
                          style={{ width: `${item.energy}%` }}
                        />
                      </div>
                    </div>
                    {item.relatedIds.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center gap-1 mb-2">
                          <Link size={9} className="text-primary" />
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Feeds into</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.relatedIds.map((relatedId) => {
                            const rel = timelineData.find((i) => i.id === relatedId);
                            return (
                              <Button
                                key={relatedId}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-[10px] rounded-md border-primary/20 bg-transparent hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                                onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                              >
                                {rel?.title}
                                <ArrowRight size={8} className="ml-1" />
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
