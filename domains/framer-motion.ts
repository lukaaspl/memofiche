export type OmitMotionCollidedProps<TProps> = Omit<
  TProps,
  "transition" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
>;
