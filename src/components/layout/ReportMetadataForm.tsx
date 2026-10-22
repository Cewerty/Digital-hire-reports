import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ReportMetadata } from "@/types/candidateReport";

interface ReportMetadataFormProps {
  metadata: ReportMetadata;
  candidateDisplayName: string;
  onChange: (metadata: ReportMetadata, candidateDisplayName: string) => void;
}

export function ReportMetadataForm({
  metadata,
  candidateDisplayName,
  onChange,
}: ReportMetadataFormProps) {
  const handleMetadataFieldChange = (
    field: keyof ReportMetadata,
    value: string,
  ) => {
    onChange({ ...metadata, [field]: value }, candidateDisplayName);
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="candidateDisplayName"
          className="block text-sm font-medium"
        >
          Имя в документе
        </label>
        <Input
          id="candidateDisplayName"
          value={candidateDisplayName}
          onChange={(event) => onChange(metadata, event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="recipients" className="block text-sm font-medium">
          Кому
        </label>
        <Input
          id="recipients"
          value={metadata.recipients}
          onChange={(event) =>
            handleMetadataFieldChange("recipients", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="interviewer" className="block text-sm font-medium">
          Интервьюер
        </label>
        <Input
          id="interviewer"
          value={metadata.interviewer}
          onChange={(event) =>
            handleMetadataFieldChange("interviewer", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="contact" className="block text-sm font-medium">
          Контакт
        </label>
        <Input
          id="contact"
          value={metadata.contact}
          onChange={(event) =>
            handleMetadataFieldChange("contact", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="contactDate" className="block text-sm font-medium">
          Дата контакта
        </label>
        <Input
          id="contactDate"
          type="date"
          value={metadata.contactDate}
          onChange={(event) =>
            handleMetadataFieldChange("contactDate", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="direction" className="block text-sm font-medium">
          Направление
        </label>
        <Input
          id="direction"
          value={metadata.direction}
          onChange={(event) =>
            handleMetadataFieldChange("direction", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="curator" className="block text-sm font-medium">
          Куратор
        </label>
        <Input
          id="curator"
          value={metadata.curator}
          onChange={(event) =>
            handleMetadataFieldChange("curator", event.target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="candidateStatus" className="block text-sm font-medium">
          Статус кандидата
        </label>
        <Textarea
          id="candidateStatus"
          value={metadata.candidateStatus}
          onChange={(event) =>
            handleMetadataFieldChange("candidateStatus", event.target.value)
          }
        />
      </div>
    </div>
  );
}
