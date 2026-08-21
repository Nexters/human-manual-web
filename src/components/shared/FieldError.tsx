import ErrorIcon from "@/components/shared/icons/ErrorIcon";

type FieldErrorProps = {
  message: string;
};

// 시안(2054:7812)의 13px 은 Typography 램프에 없는 크기라 raw 클래스로 둔다.
export default function FieldError({ message }: FieldErrorProps) {
  return (
    <div className="text-red flex items-center gap-[6px]">
      <span className="flex size-5 shrink-0 items-center justify-center">
        <ErrorIcon className="size-4" />
      </span>
      <span className="text-[13px] leading-none font-medium tracking-[-0.52px]">{message}</span>
    </div>
  );
}
