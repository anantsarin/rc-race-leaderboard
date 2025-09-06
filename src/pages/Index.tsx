import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LeaderboardTable } from '@/components/LeaderboardTable';
import { DriverForm } from '@/components/DriverForm';
import { Driver } from '@/types/racing';
import { calculatePoints } from '@/utils/points';
import { Plus, Flag, Users, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | undefined>();
  const { toast } = useToast();

  // Load drivers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('racing-drivers');
    if (saved) {
      try {
        const savedDrivers = JSON.parse(saved);
        setDrivers(calculatePoints(savedDrivers));
      } catch (error) {
        console.error('Failed to load drivers:', error);
      }
    }
  }, []);

  // Save drivers to localStorage whenever drivers change
  useEffect(() => {
    if (drivers.length > 0) {
      localStorage.setItem('racing-drivers', JSON.stringify(drivers));
    }
  }, [drivers]);

  const handleSaveDriver = (driver: Driver) => {
    let updatedDrivers;
    
    if (editingDriver) {
      updatedDrivers = drivers.map(d => d.id === driver.id ? driver : d);
      toast({
        title: "Driver Updated",
        description: `${driver.name} has been updated successfully.`,
      });
    } else {
      updatedDrivers = [...drivers, driver];
      toast({
        title: "Driver Added",
        description: `${driver.name} has been added to the leaderboard.`,
      });
    }
    
    const calculatedDrivers = calculatePoints(updatedDrivers);
    const sortedDrivers = calculatedDrivers.sort((a, b) => b.totalPoints - a.totalPoints);
    
    setDrivers(sortedDrivers);
    setShowForm(false);
    setEditingDriver(undefined);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDeleteDriver = (id: string) => {
    const driver = drivers.find(d => d.id === id);
    setDrivers(prev => {
      const filtered = prev.filter(d => d.id !== id);
      return calculatePoints(filtered).sort((a, b) => b.totalPoints - a.totalPoints);
    });
    
    toast({
      title: "Driver Removed",
      description: `${driver?.name || 'Driver'} has been removed from the leaderboard.`,
      variant: "destructive",
    });
  };

  const handleAddDriver = () => {
    setEditingDriver(undefined);
    setShowForm(true);
  };

  const stats = {
    totalDrivers: drivers.length,
    completedSprints: drivers.filter(d => d.sprintRace.position).length,
    completedFeatures: drivers.filter(d => d.featureRace.position).length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-racing text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">RC Car Racing Leaderboard</h1>
              <p className="mt-2 text-lg opacity-90">F3 Style Championship Standings</p>
            </div>
            <Button 
              onClick={handleAddDriver}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Driver
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <Users className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-racing-green">{stats.totalDrivers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sprint Races</CardTitle>
              <Flag className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-racing-green">{stats.completedSprints}</div>
              <p className="text-xs text-muted-foreground">completed</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feature Races</CardTitle>
              <Trophy className="ml-auto h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-racing-green">{stats.completedFeatures}</div>
              <p className="text-xs text-muted-foreground">completed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {drivers.length === 0 ? (
          <Card className="mx-auto max-w-md bg-gradient-card shadow-card">
            <CardContent className="p-8 text-center">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">No Drivers Yet</h3>
              <p className="mb-4 text-muted-foreground">
                Add your first driver to start building the leaderboard!
              </p>
              <Button onClick={handleAddDriver} className="bg-gradient-racing">
                <Plus className="mr-2 h-4 w-4" />
                Add First Driver
              </Button>
            </CardContent>
          </Card>
        ) : (
          <LeaderboardTable 
            drivers={drivers}
            onEditDriver={handleEditDriver}
            onDeleteDriver={handleDeleteDriver}
          />
        )}
      </div>

      {/* Driver Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm">
          <DriverForm
            driver={editingDriver}
            onSave={handleSaveDriver}
            onCancel={() => {
              setShowForm(false);
              setEditingDriver(undefined);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Index;