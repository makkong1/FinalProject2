import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function BillingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [billingConfirmed, setBillingConfirmed] = useState(false);

  useEffect(() => {
    // 서버로 빌링키 발급을 위해 authKey 를 보내세요.
    async function issueBillingKey() {
      const requestData = {
        customerKey: searchParams.get("customerKey"),
        authKey: searchParams.get("authKey"),
      };

      const response = await fetch("/api/issue-billing-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }

    issueBillingKey()
      .then(function (data) {
        // 빌링키 발급에 성공했을 경우 UI 처리 로직을 구현하세요.
        setResponseData(data);
      })
      .catch((err) => {
        // 빌링키 발급에 실패했을 경우 UI 처리 로직을 구현하세요.
        navigate(`/fail?message=${err.message}&code=${err.code}`);
      });
  }, []);

  // 정기결제 실행
  async function confirm() {
    async function confirmBilling() {
      const requestData = {
        customerKey: searchParams.get("customerKey"),
        amount: 4900,
        orderId: generateRandomString(),
        orderName: "프리미엄 구독",
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
      };

      const response = await fetch("/api/confirm-billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }

    confirmBilling()
      .then(function (data) {
        setBillingConfirmed(true);
        setResponseData(data);
      })
      .catch((err) => {
        navigate(`/fail?message=${err.message}&code=${err.code}`);
      });
  }

  return (
    <div className="wrapper">
      <div className="box_section" style={{ width: "600px" }}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          alt="Check mark"
        />
        <h2 id="title">
          {billingConfirmed
            ? "빌링키로 결제에 성공했어요"
            : "빌링키 발급을 완료했어요"}
        </h2>

        {!billingConfirmed && (
          <button id="confirm" className="button" onClick={confirm}>
            강제로 정기결제 실행시키기
          </button>
        )}

        <div className="p-grid" style={{ marginTop: "30px" }}>
          <button
            className="button p-grid-col5"
            onClick={() => {
              navigate(
                "https://docs.tosspayments.com/guides/payment/integration"
              );
            }}
          >
            연동 문서
          </button>
          <button
            className="button p-grid-col5"
            onClick={() => {
              navigate("https://discord.gg/A4fRFXQhRu");
            }}
            style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
          >
            실시간 문의
          </button>
        </div>
        <div
          className="box_section"
          style={{ width: "600px", textAlign: "left" }}
        >
          <b>Response Data :</b>
          <div id="response" style={{ whiteSpace: "initial" }}>
            {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

export default BillingPage;
