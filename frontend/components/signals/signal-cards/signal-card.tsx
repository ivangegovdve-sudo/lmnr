"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { isNil } from "lodash";
import Link from "next/link";

import SignalSparkline from "@/components/signals/signal-sparkline.tsx";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type SignalRow } from "@/lib/actions/signals";
import { type SignalSparklineData } from "@/lib/actions/signals/stats";
import { track } from "@/lib/posthog";
import { formatRelativeTime, formatShortDate } from "@/lib/utils.ts";

import SignalCardMenu from "./signal-card-menu";

export default function SignalCard({
  signal,
  projectId,
  sparklineData,
  sparklineMaxCount,
  onDelete,
}: {
  signal: SignalRow;
  projectId: string;
  sparklineData: SignalSparklineData;
  sparklineMaxCount?: number;
  onDelete: () => Promise<boolean>;
}) {
  const data = sparklineData[signal.id];
  const isSparklineLoading = isNil(data);
  const signalUrl = `/project/${projectId}/signals/${signal.id}`;

  // The <Link> wraps the navigable content only; the menu is an absolutely-
  // positioned sibling (NOT inside the anchor) so it stays interactive without
  // nesting a <button> in an <a>. Header reserves right padding for the menu.
  return (
    <Card className="relative hover:border-primary/40 transition-colors h-full">
      <div className="absolute right-2 top-2.5 z-10">
        <SignalCardMenu signalId={signal.id} signalName={signal.name} projectId={projectId} onDelete={onDelete} />
      </div>
      <Link
        href={signalUrl}
        className="block h-full"
        onClick={() => track("signals", "events_viewed", { event_count: signal.eventsCount })}
      >
        <CardHeader className="px-3 pt-3 pb-1">
          <h3 className="font-medium text-sm truncate pr-8">{signal.name}</h3>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-2 space-y-2">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2lh]">{signal.prompt}</p>
              </TooltipTrigger>
              {signal.prompt && (
                <TooltipPrimitive.Portal>
                  <TooltipContent side="bottom" align="start" className="max-w-[350px] border">
                    <p className="text-muted-foreground whitespace-pre-wrap">{signal.prompt}</p>
                  </TooltipContent>
                </TooltipPrimitive.Portal>
              )}
            </Tooltip>
          </TooltipProvider>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="flex flex-col items-center p-1.5 rounded-md bg-secondary/50">
              <span className="flex-1 flex flex-col justify-center text-base font-semibold">{signal.eventsCount}</span>
              <span className="text-[10px] text-muted-foreground">Events</span>
            </div>
            <div className="flex flex-col items-center p-1.5 rounded-md bg-secondary/50">
              <span className="flex-1 flex flex-col justify-center text-base font-semibold">
                {signal.clustersCount}
              </span>
              <span className="text-[10px] text-muted-foreground">Clusters</span>
            </div>
            <div className="flex flex-col items-center p-1.5 rounded-md bg-secondary/50">
              <span
                title={signal?.lastEventAt ?? "-"}
                className="flex-1 flex flex-col justify-center text-sm font-medium"
              >
                {formatRelativeTime(signal.lastEventAt)}
              </span>
              <span className="text-[10px] text-muted-foreground">Last event</span>
            </div>
          </div>
          <div className="h-[36px] w-full">
            <SignalSparkline data={data ?? []} maxCount={sparklineMaxCount} isLoading={isSparklineLoading} />
          </div>
        </CardContent>
        <CardFooter className="px-3 pb-3 pt-0 flex items-center justify-between text-[10px] text-muted-foreground">
          <div title={signal.createdAt}>Created {formatShortDate(signal.createdAt)}</div>
        </CardFooter>
      </Link>
    </Card>
  );
}
