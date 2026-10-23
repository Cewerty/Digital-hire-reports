import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ReportValidationError } from "@/lib/validateReport";
import type { ReportMetadata } from "@/types/candidateReport";
import { useId } from "react";

interface ReportMetadataFormProps {
  metadata: ReportMetadata;
  candidateDisplayName: string;
  onChange: (metadata: ReportMetadata, candidateDisplayName: string) => void;
  /** Ошибки валидации: показываются под соответствующими полями. */
  errors?: ReportValidationError[];
}

export function ReportMetadataForm({
  metadata,
  candidateDisplayName,
  onChange,
  errors = [],
}: ReportMetadataFormProps) {
  const errorIdBase = useId();

  const messageFor = (field: ReportValidationError["field"]) =>
    errors.find((error) => error.field === field)?.message;

  const errorIdFor = (field: string) => `${errorIdBase}-${field}-error`;

  const ariaFor = (field: ReportValidationError["field"]) => {
    const message = messageFor(field);

    return {
      "aria-invalid": Boolean(message),
      "aria-describedby": message ? errorIdFor(field) : undefined,
    };
  };

  const renderError = (field: ReportValidationError["field"]) => {
    const message = messageFor(field);
    if (!message) {
      return null;
    }

    return (
      <p
        id={errorIdFor(field)}
        role="alert"
        className="mt-1 text-sm text-red-600"
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
      <div data-field="candidateDisplayName">
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

      <div data-field="recipients">
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

      <div data-field="interviewer">
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

      <div data-field="contact">
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

      <div data-field="contactDate">
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

      <div data-field="direction">
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

      <div data-field="curator">
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

      <div data-field="candidateStatus">
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
