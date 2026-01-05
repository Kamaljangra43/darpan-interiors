import DarpanInteriorsPortfolio from "../portfolio"

// Enable ISR with 60-second revalidation
export const revalidate = 60;

// Force dynamic behavior for initial data fetching
export const dynamic = 'force-dynamic';

export default function Page() {
  return <DarpanInteriorsPortfolio />
}
