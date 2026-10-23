import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PROPERTY_ROW_HOVER_CLASS } from "@/lib/surfaces";
import type { ReportValidationError } from "@/lib/validateReport";
import type { ReportMetadata } from "@/types/candidateReport";
import { useId } from "react";

/**
 * Ключи полей, по которым форма ищет и показывает ошибки валидации:
 * имя в документе и реквизиты отчёта.
 */
type ReportErrorField = ReportValidationError["field"] | keyof ReportMetadata;

interface ReportMetadataFormProps {
  metadata: ReportMetadata;
  candidateDisplayName: string;
  onChange: (metadata: ReportMetadata, candidateDisplayName: string) => void;
  /** Ошибки валидации: показываются под соответствующими полями. */
  errors?: ReportValidationError[];
}

/**
 * Строка свойства в духе Notion: при наведении подсвечивается отдельной
 * поверхностью `bg-white` / `#2F2F2F`, чтобы не сливаться с фоном карточки.
 */
const FIELD_ROW_CLASS = `-mx-2 space-y-1 rounded-lg p-2 ${PROPERTY_ROW_HOVER_CLASS}`;

export function ReportMetadataForm({
  metadata,
  candidateDisplayName,
  onChange,
  errors = [],
}: ReportMetadataFormProps) {
  const errorIdBase = useId();

  const messageFor = (field: ReportErrorField) =>
    errors.find((error) => error.field === field)?.message;

  const errorIdFor = (field: string) => `${errorIdBase}-${field}-error`;

  const ariaFor = (field: ReportErrorField) => {
    const message = messageFor(field);

    return {
      "aria-invalid": Boolean(message),
      "aria-describedby": message ? errorIdFor(field) : undefined,
    };
  };

  const renderError = (field: ReportErrorField) => {
    const message = messageFor(field);
    if (!message) {
      return null;
    }

    return (
      <p
        id={errorIdFor(field)}
        role="alert"
        className="mt-1 text-sm text-red-600 dark:text-rose-300"
      >
        {message}
      </p>
    );
  };

  const handleMetadataFieldChange = (
    field: keyof ReportMetadata,
    value: string,
  ) => {
    onChange({ ...metadata, [field]: value }, candidateDisplayName);
  };

  return (
    <div className="space-y-4">
      <div data-field="candidateDisplayName" className={FIELD_ROW_CLASS}>
        <Label htmlFor="candidateDisplayName" className="block">
          Имя в документе
        </Label>
        <Input
          id="candidateDisplayName"
          value={candidateDisplayName}
          {...ariaFor("candidateDisplayName")}
          onChange={(event) => onChange(metadata, event.target.value)}
        />
        {renderError("candidateDisplayName")}
      </div>

      <div data-field="recipients" className={FIELD_ROW_CLASS}>
        <Label htmlFor="recipients" className="block">
          Кому
        </Label>
        <Input
          id="recipients"
          value={metadata.recipients}
          {...ariaFor("recipients")}
          onChange={(event) =>
            handleMetadataFieldChange("recipients", event.target.value)
          }
        />
        {renderError("recipients")}
      </div>

      <div data-field="interviewer" className={FIELD_ROW_CLASS}>
        <Label htmlFor="interviewer" className="block">
          Интервьюер
        </Label>
        <Input
          id="interviewer"
          value={metadata.interviewer}
          {...ariaFor("interviewer")}
          onChange={(event) =>
            handleMetadataFieldChange("interviewer", event.target.value)
          }
        />
        {renderError("interviewer")}
      </div>

      <div data-field="contact" className={FIELD_ROW_CLASS}>
        <Label htmlFor="contact" className="block">
          Контакт
        </Label>
        <Input
          id="contact"
          value={metadata.contact}
          {...ariaFor("contact")}
          onChange={(event) =>
            handleMetadataFieldChange("contact", event.target.value)
          }
        />
        {renderError("contact")}
      </div>

      <div data-field="contactDate" className={FIELD_ROW_CLASS}>
        <Label htmlFor="contactDate" className="block">
          Дата контакта
        </Label>
        <Input
          id="contactDate"
          type="date"
          value={metadata.contactDate}
          {...ariaFor("contactDate")}
          onChange={(event) =>
            handleMetadataFieldChange("contactDate", event.target.value)
          }
        />
        {renderError("contactDate")}
      </div>

      <div data-field="direction" className={FIELD_ROW_CLASS}>
        <Label htmlFor="direction" className="block">
          Направление
        </Label>
        <Input
          id="direction"
          value={metadata.direction}
          {...ariaFor("direction")}
          onChange={(event) =>
            handleMetadataFieldChange("direction", event.target.value)
          }
        />
        {renderError("direction")}
      </div>

      <div data-field="curator" className={FIELD_ROW_CLASS}>
        <Label htmlFor="curator" className="block">
          Куратор
        </Label>
        <Input
          id="curator"
          value={metadata.curator}
          {...ariaFor("curator")}
          onChange={(event) =>
            handleMetadataFieldChange("curator", event.target.value)
          }
        />
        {renderError("curator")}
      </div>

      <div data-field="candidateStatus" className={FIELD_ROW_CLASS}>
        <Label htmlFor="candidateStatus" className="block">
          Статус кандидата
        </Label>
        <Textarea
          id="candidateStatus"
          value={metadata.candidateStatus}
          {...ariaFor("candidateStatus")}
          onChange={(event) =>
            handleMetadataFieldChange("candidateStatus", event.target.value)
          }
        />
        {renderError("candidateStatus")}
      </div>
    </div>
  );
}
