import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./ui/button";

interface NewFlashcardFormProps {
  onAddFlashcard: (observe: string, reverse: string) => void;
}

type FormValues = {
  observe: string;
  reverse: string;
};

export default function NewFlashcardForm({
  onAddFlashcard,
}: NewFlashcardFormProps): JSX.Element {
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onAddFlashcard(data.observe, data.reverse);
    reset();
  };

  return (
    <form className="new-card-form" onSubmit={handleSubmit(onSubmit)}>
      <h3 className="new-card-form__input-label">Obverse</h3>
      <input
        type="text"
        autoComplete="off"
        className="new-card-form__input"
        placeholder="What is the best programming language?"
        {...register("observe", { required: true })}
      />
      <h3 className="new-card-form__input-label">Reverse</h3>
      <input
        type="text"
        autoComplete="off"
        className="new-card-form__input"
        placeholder="JavaScript"
        {...register("reverse", { required: true })}
      />
      <Button type="submit" style={{ margin: "6px 0" }}>
        Add flashcard
      </Button>
    </form>
  );
}
