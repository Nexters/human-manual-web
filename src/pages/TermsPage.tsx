import PolicyPageLayout, { PolicyList, PolicySection } from "@/components/policy/PolicyPageLayout";

export default function TermsPage() {
  return (
    <PolicyPageLayout title="이용약관" effectiveDate="2026년 10월 6일">
      <PolicySection title="제1조 (목적)">
        <p>
          이 약관은 언더스탠드라인(이하 “회사”)이 운영하는 Pakit 서비스(이하 “서비스”)의 이용과
          관련하여 회사와 이용자 사이의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.
        </p>
      </PolicySection>

      <PolicySection title="제2조 (서비스의 내용)">
        <p>회사는 이용자에게 다음 서비스를 제공합니다.</p>
        <PolicyList>
          <li>질문 응답을 바탕으로 한 캐릭터 진단 및 결과 제공</li>
          <li>결과 코드를 이용한 친구와의 케미 분석</li>
          <li>두 사람의 관계 분석을 담은 유료 맞춤 관계 설명서</li>
          <li>그 밖에 회사가 추가로 개발하거나 제휴를 통해 제공하는 서비스</li>
        </PolicyList>
        <p>
          진단과 관계 분석 결과는 오락 및 참고 목적으로 제공되며, 의학적·심리학적 진단이나 전문적인
          상담을 대신하지 않습니다.
        </p>
      </PolicySection>

      <PolicySection title="제3조 (약관의 게시와 변경)">
        <p>
          회사는 이용자가 쉽게 확인할 수 있도록 이 약관을 서비스에 게시합니다. 관련 법령을 위반하지
          않는 범위에서 약관을 변경할 수 있으며, 중요한 변경사항은 적용일과 변경 사유를 서비스
          내에서 사전에 안내합니다.
        </p>
      </PolicySection>

      <PolicySection title="제4조 (서비스 이용과 결과 코드)">
        <PolicyList>
          <li>서비스는 별도 회원가입 없이 이용할 수 있습니다.</li>
          <li>
            결과 코드는 진단 결과와 구매한 관계 설명서를 열람하는 데 사용되므로 이용자가 직접
            안전하게 보관해야 합니다.
          </li>
          <li>
            이용자가 결과 코드 또는 결과 페이지 링크를 제3자에게 공유하면 해당 제3자가 결과를 열람할
            수 있습니다.
          </li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="제5조 (유료 서비스의 구매와 제공)">
        <PolicyList>
          <li>상품명: 맞춤 관계 설명서</li>
          <li>가격: 990원</li>
          <li>결제수단: 카카오페이</li>
          <li>제공시점: 결제 승인 완료 후 즉시</li>
          <li>이용기간: 서비스 운영 기간 동안 해당 궁합 결과 페이지에서 열람 가능</li>
        </PolicyList>
        <p>
          구매계약은 이용자가 주문 내용을 확인하고 결제를 완료한 시점에 성립합니다. 결제 과정은
          카카오페이가 제공하는 결제창을 통해 진행됩니다.
        </p>
      </PolicySection>

      <PolicySection title="제6조 (취소와 환불)">
        <p>
          유료 서비스의 청약철회, 취소 및 환불은 서비스에 게시된 취소·환불 정책과 관련 법령에
          따릅니다. 맞춤 관계 설명서는 결제 완료 후 즉시 제공되므로 제공이 시작된 뒤에는 단순 변심에
          따른 청약철회가 제한될 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="제7조 (이용자의 의무)">
        <PolicyList>
          <li>다른 사람의 정보를 동의 없이 입력하거나 결과 코드를 부정하게 이용하지 않습니다.</li>
          <li>서비스의 정상적인 운영을 방해하거나 자동화된 방법으로 과도하게 접근하지 않습니다.</li>
          <li>서비스의 콘텐츠를 회사의 허락 없이 복제, 배포 또는 상업적으로 이용하지 않습니다.</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="제8조 (서비스의 변경과 중단)">
        <p>
          회사는 운영상 또는 기술상 필요한 경우 서비스의 전부 또는 일부를 변경하거나 중단할 수
          있습니다. 유료 서비스 이용에 중대한 영향을 주는 변경 또는 중단은 가능한 범위에서 미리
          안내하고, 회사의 책임 있는 사유로 구매한 서비스를 제공하지 못한 경우 관련 법령에 따라
          환불합니다.
        </p>
      </PolicySection>

      <PolicySection title="제9조 (지식재산권)">
        <p>
          서비스와 서비스에서 제공하는 문구, 이미지, 캐릭터, 분석 결과 등 콘텐츠에 관한 저작권 및
          지식재산권은 회사 또는 정당한 권리자에게 있습니다. 이용자는 개인적이고 비상업적인 범위에서
          결과를 이용하고 공유할 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="제10조 (책임의 제한)">
        <p>
          회사는 천재지변, 통신망 장애, 결제기관의 장애 등 회사가 합리적으로 통제하기 어려운 사유로
          발생한 손해에 대하여 책임을 지지 않습니다. 다만, 회사의 고의 또는 중대한 과실이 있는
          경우에는 그러하지 않습니다.
        </p>
      </PolicySection>

      <PolicySection title="제11조 (분쟁 해결과 준거법)">
        <p>
          이 약관은 대한민국 법령에 따릅니다. 서비스 이용과 관련한 문의나 분쟁은 고객센터
          010-5310-3084로 접수할 수 있으며, 회사와 이용자는 원만한 해결을 위해 성실히 협의합니다.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
}
