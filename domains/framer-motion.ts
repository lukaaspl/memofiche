export type MotionCustomComponentProps<TProps> = Omit<TProps, "transition">;

export type OmitMotionCollidedProps<TProps> = Omit<
  TProps,
  "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag"
>;
