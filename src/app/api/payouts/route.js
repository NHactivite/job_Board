// async function createTransfer() {
//   const res = await fetch(
//     "https://sandbox.cashfree.com/payout/transfers",
//     {
//       method: "POST",
//       headers: {
//         "x-client-id": process.env.CLIENT_ID,
//         "x-client-secret":  process.env.CLIENT_SECRET,
//         "x-api-version": "2024-01-01",
//         "Content-Type": "application/json",
//         "x-request-id": `req_${Date.now()}`
//       },
//       body: JSON.stringify({
//         transfer_id: `WD_${Date.now()}`, // UNIQUE every time
//         transfer_amount: 1.0,
//         transfer_currency: "INR",
//         transfer_mode: "banktransfer",
//         transfer_remarks: "Wallet withdrawal",
//         beneficiary_details: {
//           beneficiary_id: "JOHN18011"
//         }
//       })
//     }
//   );

//   const data = await res.json();
//   console.log("Transfer response:", data);
// }

// createTransfer().catch(console.error);
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const tokenRes = await fetch(
           "https://payout-gamma.cashfree.com/payout/v1/authorize",
      {
        method: "POST",
        headers: {
          "X-Client-Id": process.env.CLIENT_ID,
          "X-Client-Secret": process.env.CLIENT_SECRET
        }
      }
    );

    const tokenData = await tokenRes.json();
    console.log(tokenData,"jooo");
    
    if (tokenData.status !== "SUCCESS") {
      return NextResponse.json(tokenData, { status: 401 });
    }

    const token = tokenData.data.token;

    const cashgramRes = await fetch(
       "https://payout-gamma.cashfree.com/payout/v1/createCashgram",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cashgramId: `CG_${Date.now()}`,
          amount: 50,
          name: "Test User",
          phone: "8822675971",
          email: "test@email.com",
          linkExpiry: "2026/02/28",
          remarks: "Wallet withdrawal",
          notifyCustomer: true,
          payoutType: "WITHDRAWAL"
        })
      }
    );

    const data = await cashgramRes.json();
    console.log(data,"mppp");
    
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
