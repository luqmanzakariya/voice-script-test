import DashboardPage from "@/components/page/dashboard";
import { getJobsServer } from "@/service/server/jobs";
import { getUserReporter, getUserEditor } from "@/service/server/users";

const Dashboard = async () => {
  const [jobs, reporters, editors] = await Promise.all([
    getJobsServer(),
    getUserReporter(),
    getUserEditor(),
  ]);
  return <DashboardPage jobs={jobs} reporters={reporters} editors={editors} />;
};

export default Dashboard;
