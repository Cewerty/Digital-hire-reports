import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        <Label htmlFor="candidateDisplayName" className="block">
          Имя в документе
        </Label>
        <Input
          id="candidateDisplayName"
          value={candidateDisplayName}
          onChange={(event) => onChange(metadata, event.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="recipients" className="block">
          Кому
        </Label>
        <Input
          id="recipients"
          value={metadata.recipients}
          onChange={(event) =>
            handleMetadataFieldChange("recipients", event.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="interviewer" className="block">
          Интервьюер
        </Label>
        <Input
          id="interviewer"
          value={metadata.interviewer}
          onChange={(event) =>
            handleMetadataFieldChange("interviewer", event.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="contact" className="block">
          Контакт
        </Label>
        <Input
          id="contact"
          value={metadata.contact}
          onChange={(event) =>
            handleMetadataFieldChange("contact", event.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="contactDate" className="block">
          Дата контакта
        </Label>
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
        <Label htmlFor="direction" className="block">
          Направление
        </Label>
        <Input
          id="direction"
          value={metadata.direction}
          onChange={(event) =>
            handleMetadataFieldChange("direction", event.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="curator" className="block">
          Куратор
        </Label>
        <Input
          id="curator"
          value={metadata.curator}
          onChange={(event) =>
            handleMetadataFieldChange("curator", event.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="candidateStatus" className="block">
          Статус кандидата
        </Label>
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
