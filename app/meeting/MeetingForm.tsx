"use client";

import { MeetingMeta } from "@/features/meeting";
import { FormField, Input, Select, Cluster } from "@/components";

interface MeetingFormProps {
  data: MeetingMeta;
  onChange: <K extends keyof MeetingMeta>(field: K, value: MeetingMeta[K]) => void;
  disabled?: boolean;
}

export function MeetingForm({ data, onChange, disabled }: MeetingFormProps) {
  return (
    <div className="meta-grid">
      <FormField label="회의 제목" htmlFor="title">
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="예: 4월 마케팅 전략 회의"
          disabled={disabled}
        />
      </FormField>
      <FormField label="참석자" htmlFor="participants">
        <Input
          id="participants"
          value={data.participants}
          onChange={(e) => onChange("participants", e.target.value)}
          placeholder="예: 김철수, 이영희"
          disabled={disabled}
        />
      </FormField>
      <FormField label="Teams 공유 팀" htmlFor="team">
        <Select
          id="team"
          value={data.team}
          onChange={(e) => onChange("team", e.target.value)}
          disabled={disabled}
        >
          <option value="교육개발">교육개발</option>
          <option value="주문제작">주문제작</option>
          <option value="영업마케팅">영업마케팅</option>
          <option value="크레용스쿨">크레용스쿨</option>
          <option value="플랫폼머즈">플랫폼머즈</option>
          <option value="콘텐츠제작">콘텐츠 제작</option>
          <option value="쇼핑몰">쇼핑몰</option>
          <option value="일반업무">일반업무</option>
          <option value="디자인개발">디자인 개발</option>
        </Select>
        <label className="check-wrap mt-2">
          <input
            type="checkbox"
            checked={data.postToTeams}
            onChange={(e) => onChange("postToTeams", e.target.checked)}
            disabled={disabled}
          />
          Teams로 공유
        </label>
      </FormField>
      <Cluster className="cluster-center gap-md mt-2">
        <FormField label="날짜" htmlFor="date">
          <Input
            id="date"
            type="date"
            value={data.meetingDate}
            onChange={(e) => onChange("meetingDate", e.target.value)}
            disabled={disabled}
          />
        </FormField>
        <FormField label="장소" htmlFor="location">
          <Input
            id="location"
            value={data.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="예: 본사 회의실"
            disabled={disabled}
          />
        </FormField>
      </Cluster>
    </div>
  );
}
