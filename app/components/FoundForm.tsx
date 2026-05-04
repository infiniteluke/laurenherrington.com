import { Form } from "react-router";

interface Props {
  artId: string;
  disabled?: boolean;
}

function nowDatetimeLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const fieldsetClass =
  "border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight bg-win95-silver px-3 py-2";

const inputClass =
  "border-2 border-t-win95-shadow border-l-win95-shadow border-b-win95-highlight border-r-win95-highlight bg-white px-2 py-1 w-full text-sm";

const buttonClass = [
  "px-3 py-1 select-none bg-win95-silver",
  "border-2 border-t-win95-highlight border-l-win95-highlight border-b-win95-shadow border-r-win95-shadow",
  "shadow-[1px_1px_0_black]",
  "active:border-t-win95-shadow active:border-l-win95-shadow active:border-b-win95-highlight active:border-r-win95-highlight",
  "active:shadow-none active:translate-x-px active:translate-y-px",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export function FoundForm({ artId, disabled }: Props) {
  return (
    <Form method="post" className="flex flex-col gap-3 w-full max-w-md">
      <input type="hidden" name="intent" value="submit" />
      <input type="hidden" name="artId" value={artId} />

      <fieldset className={fieldsetClass}>
        <label className="flex flex-col gap-1 text-sm">
          Found by
          <input
            type="text"
            name="foundBy"
            maxLength={80}
            placeholder="Your name (optional)"
            className={inputClass}
            disabled={disabled}
          />
        </label>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <label className="flex flex-col gap-1 text-sm">
          Location
          <input
            type="text"
            name="location"
            maxLength={200}
            placeholder="Where did you find it? (optional)"
            className={inputClass}
            disabled={disabled}
          />
        </label>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <label className="flex flex-col gap-1 text-sm">
          Date / time
          <input
            type="datetime-local"
            name="foundAt"
            required
            defaultValue={nowDatetimeLocal()}
            className={inputClass}
            disabled={disabled}
          />
        </label>
      </fieldset>

      <fieldset className={fieldsetClass}>
        <legend className="text-sm px-1">Did you take me home?</legend>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="adopted"
              value="0"
              defaultChecked
              disabled={disabled}
            />
            No
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" name="adopted" value="1" disabled={disabled} />
            Yes
          </label>
        </div>
      </fieldset>

      <button type="submit" className={buttonClass} disabled={disabled}>
        Register find
      </button>
    </Form>
  );
}
