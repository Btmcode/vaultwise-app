
"use client"
import * as React from "react"
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { Resizable } from 're-resizable';

import { assets } from "@/lib/data";
import { GoldIcon, SilverIcon, BtcIcon, PaxgIcon, XautIcon } from "@/components/icons";
import type { AssetSymbol } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StrictModeDroppable } from "@/components/strict-mode-droppable";

const iconMap: Record<AssetSymbol, React.FC<React.SVGProps<SVGSVGElement>>> = {
    XAU: GoldIcon,
    XAG: SilverIcon,
    BTC: BtcIcon,
    PAXG: PaxgIcon,
    XAUT: XautIcon
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function LivePrices({ dict }: { dict: any }) {
  const [assetOrder, setAssetOrder] = React.useState<AssetSymbol[]>(Object.keys(assets) as AssetSymbol[]);
  const [cardWidth, setCardWidth] = React.useState(200);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(assetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAssetOrder(items);
  };
  
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <StrictModeDroppable droppableId="live-prices" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex overflow-x-auto p-4 gap-4"
          >
            {assetOrder.map((symbol, index) => {
              const asset = assets[symbol];
              const Icon = iconMap[asset.symbol];
              return (
                <Draggable key={asset.symbol} draggableId={asset.symbol} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={cn(snapshot.isDragging ? "shadow-lg" : "")}
                    >
                      <Resizable
                        size={{ width: cardWidth, height: 'auto' }}
                        minWidth={150}
                        maxWidth={400}
                        onResizeStop={(e, direction, ref, d) => {
                          setCardWidth(cardWidth + d.width);
                        }}
                        enable={{
                            top: false,
                            right: true,
                            bottom: false,
                            left: true,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                      >
                        <div className="h-full flex items-center justify-center gap-3 p-4 rounded-lg bg-card border">
                          <div className="bg-muted p-2 rounded-full">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-grow">
                            <p className="font-medium text-sm whitespace-nowrap">{dict.assetNames[asset.symbol]}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</p>
                          </div>
                          <div
                            className={cn(
                              "text-xs font-medium",
                              asset.change24h > 0 ? "text-green-500" : "text-red-500"
                            )}
                          >
                            {asset.change24h > 0 ? "+" : ""}
                            {asset.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </Resizable>
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
}
