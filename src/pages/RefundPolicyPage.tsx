import PolicyPageLayout, { PolicyList, PolicySection } from "@/components/policy/PolicyPageLayout";

export default function RefundPolicyPage() {
  return (
    <PolicyPageLayout title="취소·환불 정책" effectiveDate="2026년 10월 6일">
      <PolicySection title="1. 상품 및 제공 조건">
        <PolicyList>
          <li>상품명: 맞춤 관계 설명서</li>
          <li>결제금액: 990원</li>
          <li>제공방법: 결제한 궁합 결과 페이지에서 온라인 열람</li>
          <li>제공시점: 카카오페이 결제 승인 완료 후 즉시</li>
          <li>이용기간: 서비스 운영 기간 동안 계속 열람 가능</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="2. 청약철회의 원칙">
        <p>
          이용자는 계약내용에 관한 안내를 받은 날부터 7일 이내에 청약철회를 요청할 수 있습니다. 다만
          맞춤 관계 설명서가 아직 제공되지 않은 경우에 한합니다.
        </p>
      </PolicySection>

      <PolicySection title="3. 청약철회의 제한">
        <p>
          맞춤 관계 설명서는 결제 완료 후 이용자에게 즉시 열람 가능한 상태로 제공되는 콘텐츠입니다.
          이용자가 결제 전 즉시 제공 사실과 청약철회 제한 가능성을 확인하고 결제한 뒤 설명서의
          제공이 시작된 경우에는 「전자상거래 등에서의 소비자보호에 관한 법률」 제17조에 따라 단순
          변심에 의한 청약철회가 제한될 수 있습니다.
        </p>
        <p>
          다만 회사가 법령에서 정한 청약철회 제한 표시 또는 필요한 조치를 하지 않은 경우에는 관련
          법령에 따라 청약철회를 요청할 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="4. 취소 또는 환불이 가능한 경우">
        <PolicyList>
          <li>결제는 완료되었으나 설명서가 제공되지 않은 경우</li>
          <li>동일한 상품이 중복 결제된 경우</li>
          <li>회사의 책임 있는 사유로 구매한 설명서를 정상적으로 열람할 수 없는 경우</li>
          <li>제공된 내용이 표시·광고 또는 계약 내용과 다르게 이행된 경우</li>
        </PolicyList>
        <p>
          표시·광고 또는 계약 내용과 다르게 제공된 경우에는 공급받은 날부터 3개월 이내이면서 그
          사실을 안 날 또는 알 수 있었던 날부터 30일 이내에 청약철회를 요청할 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="5. 환불 요청 방법">
        <p>
          고객센터 010-5310-3084로 결과 코드, 결제일시, 결제금액 및 요청 사유를 알려주세요. 회사는
          결제내역과 서비스 제공 여부를 확인한 뒤 처리 결과를 안내합니다. 카드번호나 계좌 비밀번호
          등 결제수단의 민감한 정보는 요청하지 않습니다.
        </p>
      </PolicySection>

      <PolicySection title="6. 환불 방법 및 처리기간">
        <p>
          환불이 승인되면 원칙적으로 결제에 사용한 카카오페이 결제수단으로 취소합니다. 회사는
          청약철회 또는 환불 사유를 확인한 날부터 3영업일 이내에 환급 절차를 진행하며, 실제 환급
          시점은 카카오페이 또는 카드사의 처리 일정에 따라 달라질 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="7. 기타">
        <p>
          이 정책에서 정하지 않은 사항은 「전자상거래 등에서의 소비자보호에 관한 법률」,
          「콘텐츠산업 진흥법」 등 관련 법령 및 소비자분쟁해결기준을 따릅니다.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
}
