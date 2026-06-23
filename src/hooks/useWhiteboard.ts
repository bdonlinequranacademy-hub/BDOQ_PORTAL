import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import {
  Canvas,
  Circle,
  Group,
  IText,
  Line,
  PencilBrush,
  Rect,
  Triangle,
  loadSVGFromString,
  util,
  type TPointerEventInfo,
} from "fabric";
import type { WhiteboardTool, RemoteWhiteboardSnapshot } from "@/types/classroom.types";
import {
  getCardColors,
  type QaidaCardColor,
} from "@/components/classroom/shapes/qaidaCatalog";

const HISTORY_LIMIT = 30;
const CANVAS_BG = "#FFFFFF";
const DEFAULT_COLOR = "#03214F";
const DEFAULT_WIDTH = 3;
const HISTORY_DEBOUNCE_MS = 250;
const SYNC_DEBOUNCE_MS = 700;
const RESIZE_DEBOUNCE_MS = 200;

interface UseWhiteboardOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  readOnly?: boolean;
  onDocumentChange?: (json: Record<string, unknown>) => void;
  remoteWhiteboard?: RemoteWhiteboardSnapshot | null;
  clearSignal?: number;
}

function hashJson(json: Record<string, unknown>): string {
  return JSON.stringify(json);
}

export function useWhiteboard({
  canvasRef,
  containerRef,
  readOnly = false,
  onDocumentChange,
  remoteWhiteboard,
  clearSignal = 0,
}: UseWhiteboardOptions) {
  const fabricRef = useRef<Canvas | null>(null);
  const historyRef = useRef<string[]>([]);
  const redoRef = useRef<string[]>([]);
  const isRestoringRef = useRef(false);
  const lastRemoteHashRef = useRef("");
  const lastLocalHashRef = useRef("");
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [tool, setTool] = useState<WhiteboardTool>("pen");
  const [strokeColor, setStrokeColor] = useState(DEFAULT_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(DEFAULT_WIDTH);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const toolRef = useRef<WhiteboardTool>("pen");
  toolRef.current = tool;
  const strokeColorRef = useRef(strokeColor);
  strokeColorRef.current = strokeColor;
  const readOnlyRef = useRef(readOnly);
  readOnlyRef.current = readOnly;
  const onDocumentChangeRef = useRef(onDocumentChange);
  onDocumentChangeRef.current = onDocumentChange;

  const syncHistoryFlags = useCallback(() => {
    setCanUndo(historyRef.current.length > 1);
    setCanRedo(redoRef.current.length > 0);
  }, []);

  const scheduleNetworkSync = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || readOnlyRef.current || isRestoringRef.current) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(() => {
      const json = canvas.toJSON() as Record<string, unknown>;
      const nextHash = hashJson(json);
      if (nextHash === lastLocalHashRef.current) return;
      lastLocalHashRef.current = nextHash;
      onDocumentChangeRef.current?.(json);
    }, SYNC_DEBOUNCE_MS);
  }, []);

  const commitHistory = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isRestoringRef.current) return;

    const snapshot = JSON.stringify(canvas.toJSON());
    const last = historyRef.current[historyRef.current.length - 1];
    if (last === snapshot) return;

    historyRef.current.push(snapshot);
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
    redoRef.current = [];
    syncHistoryFlags();
    scheduleNetworkSync();
  }, [scheduleNetworkSync, syncHistoryFlags]);

  const queueHistory = useCallback(() => {
    if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
    historyTimerRef.current = setTimeout(() => commitHistory(), HISTORY_DEBOUNCE_MS);
  }, [commitHistory]);

  const applyReadOnlyMode = useCallback((canvas: Canvas, locked: boolean) => {
    canvas.isDrawingMode = false;
    canvas.selection = !locked;
    canvas.skipTargetFind = locked;
    canvas.forEachObject((obj) => {
      obj.selectable = !locked;
      obj.evented = !locked;
    });
    canvas.requestRenderAll();
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = fabricRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width < 1 || height < 1) return;
    if (Math.abs(canvas.width - width) < 2 && Math.abs(canvas.height - height) < 2) return;

    canvas.setDimensions({ width, height });
    canvas.requestRenderAll();
  }, [containerRef]);

  const queueResize = useCallback(() => {
    if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    resizeTimerRef.current = setTimeout(() => resizeCanvas(), RESIZE_DEBOUNCE_MS);
  }, [resizeCanvas]);

  const applyBrush = useCallback(
    (canvas: Canvas, activeTool: WhiteboardTool, color: string, width: number) => {
      if (readOnlyRef.current) {
        applyReadOnlyMode(canvas, true);
        return;
      }

      if (activeTool === "pen" || activeTool === "eraser") {
        const brush = new PencilBrush(canvas);
        brush.color = activeTool === "eraser" ? CANVAS_BG : color;
        brush.width = activeTool === "eraser" ? width * 4 : width;
        canvas.freeDrawingBrush = brush;
        canvas.isDrawingMode = true;
        canvas.selection = false;
        return;
      }

      canvas.isDrawingMode = false;
      canvas.selection = activeTool === "select";
    },
    [applyReadOnlyMode]
  );

  const addShape = useCallback(
    (kind: Exclude<WhiteboardTool, "select" | "pen" | "eraser" | "text">) => {
      const canvas = fabricRef.current;
      if (!canvas || readOnlyRef.current) return;

      const left = canvas.width / 2 - 80;
      const top = canvas.height / 2 - 60;
      const common = {
        left,
        top,
        stroke: strokeColor,
        strokeWidth,
        fill: "transparent",
        selectable: true,
      };

      let obj;
      if (kind === "rect") {
        obj = new Rect({ ...common, width: 160, height: 100 });
      } else if (kind === "circle") {
        obj = new Circle({ ...common, radius: 55, left: left + 55, top: top + 55 });
      } else if (kind === "triangle") {
        obj = new Triangle({ ...common, width: 120, height: 100 });
      } else if (kind === "line") {
        obj = new Line([left, top + 50, left + 160, top + 50], {
          stroke: strokeColor,
          strokeWidth,
          selectable: true,
        });
      } else {
        const shaft = new Line([left, top + 50, left + 120, top + 50], {
          stroke: strokeColor,
          strokeWidth,
        });
        const head = new Triangle({
          left: left + 108,
          top: top + 38,
          width: 18,
          height: 24,
          fill: strokeColor,
          stroke: strokeColor,
          angle: 90,
        });
        obj = new Group([shaft, head], { left, top, selectable: true });
      }

      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
      commitHistory();
    },
    [commitHistory, strokeColor, strokeWidth]
  );

  const handleTextPlace = useCallback((opt: TPointerEventInfo) => {
    const canvas = fabricRef.current;
    if (!canvas || readOnlyRef.current || toolRef.current !== "text" || opt.target) return;

    const pointer = canvas.getScenePoint(opt.e);
    const text = new IText("Text", {
      left: pointer.x,
      top: pointer.y,
      fill: strokeColorRef.current,
      fontFamily: "Plus Jakarta Sans, sans-serif",
      fontSize: 24,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.requestRenderAll();
    commitHistory();
  }, [commitHistory]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const canvas = new Canvas(el, {
      backgroundColor: CANVAS_BG,
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: false,
    });
    fabricRef.current = canvas;
    applyBrush(canvas, tool, strokeColor, strokeWidth);
    commitHistory();

    const onPathCreated = () => commitHistory();
    const onModified = () => queueHistory();
    const onAdded = (e: { target?: { type?: string } }) => {
      if (e.target?.type === "path") return;
      queueHistory();
    };
    const onRemoved = () => queueHistory();

    canvas.on("path:created", onPathCreated);
    canvas.on("object:modified", onModified);
    canvas.on("object:added", onAdded);
    canvas.on("object:removed", onRemoved);
    canvas.on("mouse:down", handleTextPlace);

    queueResize();
    const observer = new ResizeObserver(() => queueResize());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (historyTimerRef.current) clearTimeout(historyTimerRef.current);
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      observer.disconnect();
      canvas.off("path:created", onPathCreated);
      canvas.off("object:modified", onModified);
      canvas.off("object:added", onAdded);
      canvas.off("object:removed", onRemoved);
      canvas.off("mouse:down", handleTextPlace);
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, [canvasRef, containerRef]);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    if (readOnly) {
      applyReadOnlyMode(canvas, true);
      return;
    }
    applyBrush(canvas, tool, strokeColor, strokeWidth);
  }, [applyBrush, applyReadOnlyMode, tool, strokeColor, strokeWidth, readOnly]);

  const loadCanvasJson = useCallback(
    async (json: Record<string, unknown>) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const nextHash = hashJson(json);
      if (nextHash === lastRemoteHashRef.current || nextHash === lastLocalHashRef.current) {
        return;
      }
      lastRemoteHashRef.current = nextHash;
      lastLocalHashRef.current = nextHash;

      isRestoringRef.current = true;
      await canvas.loadFromJSON(json);
      canvas.backgroundColor = CANVAS_BG;
      canvas.requestRenderAll();
      isRestoringRef.current = false;
      historyRef.current = [JSON.stringify(canvas.toJSON())];
      redoRef.current = [];
      syncHistoryFlags();
      if (readOnlyRef.current) applyReadOnlyMode(canvas, true);
    },
    [applyReadOnlyMode, syncHistoryFlags]
  );

  useEffect(() => {
    if (!remoteWhiteboard?.json) return;
    void loadCanvasJson(remoteWhiteboard.json);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- version only
  }, [remoteWhiteboard?.version]);

  useEffect(() => {
    if (!clearSignal) return;
    const canvas = fabricRef.current;
    if (!canvas) return;
    isRestoringRef.current = true;
    canvas.clear();
    canvas.backgroundColor = CANVAS_BG;
    canvas.requestRenderAll();
    isRestoringRef.current = false;
    const snapshot = JSON.stringify(canvas.toJSON());
    historyRef.current = [snapshot];
    lastLocalHashRef.current = snapshot;
    lastRemoteHashRef.current = snapshot;
    redoRef.current = [];
    syncHistoryFlags();
    if (readOnlyRef.current) applyReadOnlyMode(canvas, true);
  }, [clearSignal, applyReadOnlyMode, syncHistoryFlags]);

  const setActiveTool = useCallback(
    (next: WhiteboardTool) => {
      setTool(next);
      if (
        next === "rect" ||
        next === "circle" ||
        next === "triangle" ||
        next === "line" ||
        next === "arrow"
      ) {
        addShape(next);
        setTool("select");
      }
    },
    [addShape]
  );

  const undo = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas || historyRef.current.length <= 1) return;

    const current = historyRef.current.pop();
    if (current) redoRef.current.push(current);

    const prev = historyRef.current[historyRef.current.length - 1];
    isRestoringRef.current = true;
    await canvas.loadFromJSON(prev);
    canvas.backgroundColor = CANVAS_BG;
    canvas.requestRenderAll();
    isRestoringRef.current = false;
    lastLocalHashRef.current = prev;
    syncHistoryFlags();
    scheduleNetworkSync();
  }, [scheduleNetworkSync, syncHistoryFlags]);

  const redo = useCallback(async () => {
    const canvas = fabricRef.current;
    const next = redoRef.current.pop();
    if (!canvas || !next) return;

    historyRef.current.push(next);
    isRestoringRef.current = true;
    await canvas.loadFromJSON(next);
    canvas.backgroundColor = CANVAS_BG;
    canvas.requestRenderAll();
    isRestoringRef.current = false;
    lastLocalHashRef.current = next;
    syncHistoryFlags();
    scheduleNetworkSync();
  }, [scheduleNetworkSync, syncHistoryFlags]);

  const clearAll = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || readOnlyRef.current) return;
    canvas.clear();
    canvas.backgroundColor = CANVAS_BG;
    canvas.requestRenderAll();
    commitHistory();
  }, [commitHistory]);

  const exportPng = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL({ format: "png", multiplier: 1.5 });
    link.click();
  }, []);

  const insertSvg = useCallback(async (svgString: string) => {
    const canvas = fabricRef.current;
    if (!canvas || readOnlyRef.current) return;

    try {
      const { objects, options } = await loadSVGFromString(svgString);
      const parsed = objects?.filter((obj): obj is NonNullable<typeof obj> => obj != null);
      if (!parsed?.length) return;

      const element = util.groupSVGElements(parsed, options);
      element.set({
        left: canvas.width / 2 - 60,
        top: canvas.height / 2 - 65,
      });
      element.scaleToWidth(120);
      canvas.add(element);
      canvas.setActiveObject(element);
      canvas.requestRenderAll();
      commitHistory();
    } catch (err) {
      console.warn("[whiteboard] Failed to insert SVG:", err);
    }
  }, [commitHistory]);

  const insertQaidaCard = useCallback(
    (text: string, _label: string, color: QaidaCardColor) => {
      const canvas = fabricRef.current;
      if (!canvas || readOnlyRef.current) return;

      const { bg, border } = getCardColors(color);
      const left = canvas.width / 2;
      const top = canvas.height / 2;
      const isArabic = /[\u0600-\u06FF]/.test(text);
      const fontSize = text.length > 2 ? 34 : 50;

      const card = new Rect({
        width: 88,
        height: 88,
        rx: 16,
        ry: 16,
        fill: bg,
        stroke: border,
        strokeWidth: 2.5,
        originX: "center",
        originY: "center",
      });

      const glyph = new IText(text, {
        fontFamily: isArabic ? "Amiri, serif" : "Plus Jakarta Sans, sans-serif",
        fontSize,
        fill: "#03214F",
        originX: "center",
        originY: "center",
        direction: isArabic ? "rtl" : "ltr",
      });

      const group = new Group([card, glyph], { left, top, selectable: true });
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.requestRenderAll();
      commitHistory();
    },
    [commitHistory]
  );

  return {
    tool,
    setTool: setActiveTool,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    canUndo,
    canRedo,
    undo,
    redo,
    clearAll,
    exportPng,
    insertSvg,
    insertQaidaCard,
    readOnly,
  };
}
