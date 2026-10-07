import PolicyPageLayout, { PolicyList, PolicySection } from "@/components/policy/PolicyPageLayout";

export default function PrivacyPage() {
  return (
    <PolicyPageLayout title="개인정보처리방침" effectiveDate="2026년 10월 6일">
      <PolicySection title="1. 개인정보 처리자">
        <p>
          언더스탠드라인(이하 “회사”)은 Pakit 서비스를 운영하며 이용자의 개인정보를 안전하게
          처리하기 위해 관련 법령을 준수합니다.
        </p>
      </PolicySection>

      <PolicySection title="2. 처리하는 개인정보의 항목, 목적 및 보유기간">
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-08">진단 및 결과 제공</p>
            <PolicyList>
              <li>항목: 닉네임, MBTI, 질문별 답변, 결과 코드</li>
              <li>목적: 진단 결과 생성·저장·재열람 및 친구와의 케미 분석</li>
              <li>처리 근거: 서비스 제공을 위한 계약의 이행 및 이용자의 요청에 따른 조치</li>
              <li>보유기간: 삭제 요청 시 또는 서비스 종료 시까지</li>
            </PolicyList>
          </div>
          <div>
            <p className="font-semibold text-gray-08">유료 서비스 주문 및 결제</p>
            <PolicyList>
              <li>항목: 주문번호, 결과 코드, 결제승인번호, 결제수단, 금액, 결제일시·상태</li>
              <li>목적: 결제 처리, 구매내역 확인, 환불 및 분쟁 대응</li>
              <li>처리 근거: 계약의 이행 및 전자상거래 관련 법령상 의무 준수</li>
              <li>보유기간: 계약 또는 청약철회 기록 5년, 대금결제 및 재화 등의 공급 기록 5년</li>
            </PolicyList>
          </div>
          <div>
            <p className="font-semibold text-gray-08">고객 문의</p>
            <PolicyList>
              <li>항목: 전화번호 등 이용자가 제공한 연락처, 문의 및 답변 내용</li>
              <li>목적: 문의 확인, 본인 확인, 민원 및 분쟁 처리</li>
              <li>처리 근거: 계약의 이행, 이용자의 요청에 따른 조치 및 관련 법령 준수</li>
              <li>보유기간: 소비자 불만 또는 분쟁처리 기록 3년</li>
            </PolicyList>
          </div>
          <div>
            <p className="font-semibold text-gray-08">서비스 보안 및 오류 대응 정보</p>
            <PolicyList>
              <li>항목: 접속 로그, IP 주소, 브라우저·기기 정보, 오류 기록</li>
              <li>목적: 부정 이용 방지, 서비스 안정성 확보 및 오류 분석</li>
              <li>처리 근거: 안전한 서비스 운영을 위한 회사의 정당한 이익</li>
              <li>보유기간: 수집일로부터 3개월</li>
            </PolicyList>
          </div>
          <div>
            <p className="font-semibold text-gray-08">서비스 이용 분석</p>
            <PolicyList>
              <li>항목: 쿠키 식별자, 접속·이용 기록, 브라우저·기기 정보</li>
              <li>목적: 서비스 이용 현황 분석 및 기능 개선</li>
              <li>보유기간: 수집일로부터 최대 14개월</li>
            </PolicyList>
          </div>
        </div>
        <p>
          결제에 사용되는 카드번호, 계좌번호 등의 원 결제정보는 회사가 직접 저장하지 않고 카카오페이
          결제창에서 처리됩니다.
        </p>
      </PolicySection>

      <PolicySection title="3. 브라우저 저장소와 쿠키">
        <p>
          서비스는 진행 중인 답변, 닉네임 및 결과 코드를 이용자의 브라우저 로컬 저장소에 보관하여
          이어하기와 결과 재열람 기능을 제공합니다. 이용자는 브라우저 설정에서 저장된 정보를 직접
          삭제할 수 있습니다.
        </p>
        <p>
          서비스는 이용 현황 분석과 기능 개선을 위해 Google Analytics 쿠키를 사용합니다. 이용자는
          브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="4. 개인정보의 제3자 제공">
        <p>
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 이용자가 사전에
          동의한 경우 또는 법령에 따라 요구되는 경우에는 필요한 범위에서 제공할 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="5. 개인정보 처리업무의 위탁">
        <PolicyList>
          <li>카카오페이: 결제 승인·취소·환불 및 결제 관련 처리</li>
          <li>Google LLC: 서비스 이용 현황 분석 및 통계</li>
        </PolicyList>
        <p>
          회사는 위탁계약 또는 각 서비스의 이용조건에 따라 개인정보가 안전하게 처리되도록 필요한
          사항을 관리합니다. 실제 결제 계약에서 카카오페이의 법적 지위가 제3자 제공에 해당하는 경우,
          회사는 결제 도입 전에 제공 항목·목적·보유기간을 별도로 공개하고 필요한 동의를 받습니다.
        </p>
      </PolicySection>

      <PolicySection title="6. 개인정보의 국외 이전">
        <PolicyList>
          <li>이전받는 자: Google LLC</li>
          <li>이전 국가: 미국</li>
          <li>이전 항목: 쿠키 식별자, 접속·이용 기록, 기기 및 브라우저 정보</li>
          <li>이전 목적: Google Analytics를 통한 서비스 이용 분석</li>
          <li>이전 시점 및 방법: 서비스 이용 시 암호화된 네트워크를 통한 전송</li>
          <li>보유기간: 수집일로부터 최대 14개월</li>
        </PolicyList>
      </PolicySection>

      <PolicySection title="7. 개인정보의 파기">
        <p>
          회사는 보유기간이 지나거나 처리 목적이 달성된 개인정보를 지체 없이 파기합니다. 전자적
          파일은 복구하기 어려운 방법으로 삭제하고, 종이 문서는 분쇄 또는 소각합니다. 법령에 따라
          별도로 보관하는 정보는 다른 개인정보와 분리하여 보관합니다.
        </p>
      </PolicySection>

      <PolicySection title="8. 이용자의 권리와 행사 방법">
        <p>
          이용자는 자신의 개인정보에 대해 열람, 정정, 삭제, 처리정지 및 동의 철회를 요청할 수
          있습니다. 요청은 고객센터 010-5310-3084로 접수할 수 있으며, 회사는 관련 법령에 따라 지체
          없이 처리합니다. 결과 코드가 필요한 요청의 경우 권리 보호를 위해 해당 코드 확인을 요청할
          수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="9. 개인정보의 안전성 확보조치">
        <p>
          회사는 접근 권한 관리, 전송구간 암호화, 보안 프로그램 적용, 접속기록 관리 등 개인정보의
          안전한 처리를 위해 필요한 기술적·관리적 보호조치를 시행합니다.
        </p>
      </PolicySection>

      <PolicySection title="10. 개인정보 보호책임자 및 문의처">
        <PolicyList>
          <li>개인정보처리자: 언더스탠드라인</li>
          <li>대표자 및 개인정보 보호책임자: 이해선</li>
          <li>연락처: 010-5310-3084</li>
        </PolicyList>
        <p>
          개인정보 침해에 대한 상담이 필요한 경우 개인정보침해 신고센터(국번 없이 118) 또는 개인정보
          분쟁조정위원회(1833-6972)에 문의할 수 있습니다.
        </p>
      </PolicySection>

      <PolicySection title="11. 처리방침의 변경">
        <p>
          이 처리방침의 내용이 변경되는 경우 시행일 전에 서비스에서 안내합니다. 이용자의 권리에
          중대한 영향을 미치는 변경은 충분한 기간을 두고 안내합니다.
        </p>
      </PolicySection>
    </PolicyPageLayout>
  );
}
