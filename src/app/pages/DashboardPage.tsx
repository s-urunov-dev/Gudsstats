import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { StatCard } from "../components/StatCard";
import { StatsSection } from "../components/StatsSection";
import { StatusBar } from "../components/StatusBar";
import { ChartCard } from "../components/ChartCard";
import { 
  FileText, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  FileEdit,
  Send,
  Archive,
  UserCheck,
  UserX,
  Shield,
  LogOut
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

interface ResumeStats {
  total: number;
  active: number;
  inactive: number;
  public: number;
  draft: number;
  published: number;
  archived: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  candidates: number;
  employers: number;
  staff: number;
  superusers: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

interface VacancyStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
  moderation: number;
  published: number;
  closed: number;
  archived: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
}

export function DashboardPage() {
  const [resumeStats, setResumeStats] = useState<ResumeStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [vacancyStats, setVacancyStats] = useState<VacancyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchStats(token);
  }, [navigate]);

  const fetchStats = async (token: string) => {
    try {
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [resumesRes, usersRes, vacanciesRes] = await Promise.all([
        fetch("https://api.guds.inc/api/v1/statistics/resumes/", { headers }),
        fetch("https://api.guds.inc/api/v1/statistics/users/", { headers }),
        fetch("https://api.guds.inc/api/v1/statistics/vacancies/", { headers }),
      ]);

      const resumesData = await resumesRes.json();
      const usersData = await usersRes.json();
      const vacanciesData = await vacanciesRes.json();

      if (resumesData.success) {
        setResumeStats(resumesData.data);
      }
      if (usersData.success) {
        setUserStats(usersData.data);
      }
      if (vacanciesData.success) {
        setVacancyStats(vacanciesData.data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Ma'lumotlarni yuklashda xatolik");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    toast.success("Tizimdan chiqdingiz");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const growthData = [
    { name: "Rezyumelar", value: resumeStats?.new_this_month || 0, color: "#3b82f6" },
    { name: "Foydalanuvchilar", value: userStats?.new_this_month || 0, color: "#8b5cf6" },
    { name: "Vakansiyalar", value: vacancyStats?.new_this_month || 0, color: "#10b981" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Statistika Paneli
            </h1>
            <p className="text-muted-foreground">
              Umumiy ma'lumotlar va hozirgi holat
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium">{user.phone_number}</p>
                
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Chiqish
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Jami Rezyumelar"
            value={resumeStats?.total || 0}
            icon={FileText}
            color="text-blue-600"
            trend={{ value: resumeStats?.new_this_month || 0, label: "bu oy" }}
          />
          <StatCard
            title="Jami Foydalanuvchilar"
            value={userStats?.total || 0}
            icon={Users}
            color="text-purple-600"
            trend={{ value: userStats?.new_this_month || 0, label: "bu oy" }}
          />
          <StatCard
            title="Jami Vakansiyalar"
            value={vacancyStats?.total || 0}
            icon={Briefcase}
            color="text-green-600"
            trend={{ value: vacancyStats?.new_this_month || 0, label: "bu oy" }}
          />
        </div>

        {/* Growth Chart */}
        <ChartCard 
          title="Oylik O'sish" 
          data={growthData} 
        />

        {/* Detailed Tabs */}
        <Tabs defaultValue="resumes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumes" className="gap-2">
              <FileText className="h-4 w-4" />
              Rezyumelar
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Foydalanuvchilar
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Vakansiyalar
            </TabsTrigger>
          </TabsList>

          {/* Resumes Tab */}
          <TabsContent value="resumes" className="space-y-6">
            <StatsSection
              title="Rezyume Statistikasi"
              subtitle="Rezyumelar bo'yicha batafsil ma'lumot"
              icon={<FileText className="h-6 w-6 text-blue-600" />}
            >
              <StatCard
                title="Faol"
                value={resumeStats?.active || 0}
                icon={CheckCircle2}
                color="text-green-600"
              />
              <StatCard
                title="Nofaol"
                value={resumeStats?.inactive || 0}
                icon={XCircle}
                color="text-red-600"
              />
              <StatCard
                title="Ommaviy"
                value={resumeStats?.public || 0}
                icon={Eye}
                color="text-blue-600"
              />
              <StatCard
                title="Qoralama"
                value={resumeStats?.draft || 0}
                icon={FileEdit}
                color="text-yellow-600"
              />
              <StatCard
                title="E'lon qilingan"
                value={resumeStats?.published || 0}
                icon={Send}
                color="text-green-600"
              />
              <StatCard
                title="Arxivlangan"
                value={resumeStats?.archived || 0}
                icon={Archive}
                color="text-gray-600"
              />
              <StatCard
                title="Bugun yangi"
                value={resumeStats?.new_today || 0}
                icon={TrendingUp}
                color="text-blue-600"
                description="Bugungi qo'shilganlar"
              />
              <StatCard
                title="Bu hafta"
                value={resumeStats?.new_this_week || 0}
                icon={Calendar}
                color="text-indigo-600"
                description="Haftalik yangilanishlar"
              />
            </StatsSection>

            <div className="grid gap-4 md:grid-cols-2">
              <StatusBar
                title="Holat bo'yicha taqsimot"
                items={[
                  { label: "E'lon qilingan", value: resumeStats?.published || 0, total: resumeStats?.total || 1, color: "#10b981" },
                  { label: "Qoralama", value: resumeStats?.draft || 0, total: resumeStats?.total || 1, color: "#f59e0b" },
                  { label: "Arxivlangan", value: resumeStats?.archived || 0, total: resumeStats?.total || 1, color: "#6b7280" }
                ]}
              />
              <StatusBar
                title="Faollik"
                items={[
                  { label: "Faol", value: resumeStats?.active || 0, total: resumeStats?.total || 1, color: "#10b981" },
                  { label: "Nofaol", value: resumeStats?.inactive || 0, total: resumeStats?.total || 1, color: "#ef4444" }
                ]}
              />
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <StatsSection
              title="Foydalanuvchi Statistikasi"
              subtitle="Foydalanuvchilar bo'yicha batafsil ma'lumot"
              icon={<Users className="h-6 w-6 text-purple-600" />}
            >
              <StatCard
                title="Faol"
                value={userStats?.active || 0}
                icon={UserCheck}
                color="text-green-600"
              />
              <StatCard
                title="Nofaol"
                value={userStats?.inactive || 0}
                icon={UserX}
                color="text-red-600"
              />
              <StatCard
                title="Kandidatlar"
                value={userStats?.candidates || 0}
                icon={Users}
                color="text-blue-600"
              />
              <StatCard
                title="Ish beruvchilar"
                value={userStats?.employers || 0}
                icon={Briefcase}
                color="text-purple-600"
              />
              <StatCard
                title="Xodimlar"
                value={userStats?.staff || 0}
                icon={Shield}
                color="text-orange-600"
              />
              <StatCard
                title="Administratorlar"
                value={userStats?.superusers || 0}
                icon={Shield}
                color="text-red-600"
              />
              <StatCard
                title="Bugun yangi"
                value={userStats?.new_today || 0}
                icon={TrendingUp}
                color="text-blue-600"
                description="Bugungi qo'shilganlar"
              />
              <StatCard
                title="Bu hafta"
                value={userStats?.new_this_week || 0}
                icon={Calendar}
                color="text-indigo-600"
                description="Haftalik yangilanishlar"
              />
            </StatsSection>

            <div className="grid gap-4 md:grid-cols-2">
              <StatusBar
                title="Foydalanuvchi turlari"
                items={[
                  { label: "Kandidatlar", value: userStats?.candidates || 0, total: userStats?.total || 1, color: "#3b82f6" },
                  { label: "Ish beruvchilar", value: userStats?.employers || 0, total: userStats?.total || 1, color: "#8b5cf6" },
                  { label: "Xodimlar", value: userStats?.staff || 0, total: userStats?.total || 1, color: "#f97316" }
                ]}
              />
              <StatusBar
                title="Faollik"
                items={[
                  { label: "Faol", value: userStats?.active || 0, total: userStats?.total || 1, color: "#10b981" },
                  { label: "Nofaol", value: userStats?.inactive || 0, total: userStats?.total || 1, color: "#ef4444" }
                ]}
              />
            </div>
          </TabsContent>

          {/* Vacancies Tab */}
          <TabsContent value="vacancies" className="space-y-6">
            <StatsSection
              title="Vakansiya Statistikasi"
              subtitle="Vakansiyalar bo'yicha batafsil ma'lumot"
              icon={<Briefcase className="h-6 w-6 text-green-600" />}
            >
              <StatCard
                title="Faol"
                value={vacancyStats?.active || 0}
                icon={CheckCircle2}
                color="text-green-600"
              />
              <StatCard
                title="Nofaol"
                value={vacancyStats?.inactive || 0}
                icon={XCircle}
                color="text-red-600"
              />
              <StatCard
                title="Qoralama"
                value={vacancyStats?.draft || 0}
                icon={FileEdit}
                color="text-yellow-600"
              />
              <StatCard
                title="Moderatsiyada"
                value={vacancyStats?.moderation || 0}
                icon={Eye}
                color="text-orange-600"
              />
              <StatCard
                title="E'lon qilingan"
                value={vacancyStats?.published || 0}
                icon={Send}
                color="text-green-600"
              />
              <StatCard
                title="Yopilgan"
                value={vacancyStats?.closed || 0}
                icon={XCircle}
                color="text-gray-600"
              />
              <StatCard
                title="Bugun yangi"
                value={vacancyStats?.new_today || 0}
                icon={TrendingUp}
                color="text-blue-600"
                description="Bugungi qo'shilganlar"
              />
              <StatCard
                title="Bu hafta"
                value={vacancyStats?.new_this_week || 0}
                icon={Calendar}
                color="text-indigo-600"
                description="Haftalik yangilanishlar"
              />
            </StatsSection>

            <div className="grid gap-4 md:grid-cols-2">
              <StatusBar
                title="Holat bo'yicha taqsimot"
                items={[
                  { label: "E'lon qilingan", value: vacancyStats?.published || 0, total: vacancyStats?.total || 1, color: "#10b981" },
                  { label: "Qoralama", value: vacancyStats?.draft || 0, total: vacancyStats?.total || 1, color: "#f59e0b" },
                  { label: "Moderatsiyada", value: vacancyStats?.moderation || 0, total: vacancyStats?.total || 1, color: "#f97316" },
                  { label: "Yopilgan", value: vacancyStats?.closed || 0, total: vacancyStats?.total || 1, color: "#6b7280" }
                ]}
              />
              <StatusBar
                title="Faollik"
                items={[
                  { label: "Faol", value: vacancyStats?.active || 0, total: vacancyStats?.total || 1, color: "#10b981" },
                  { label: "Nofaol", value: vacancyStats?.inactive || 0, total: vacancyStats?.total || 1, color: "#ef4444" }
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}