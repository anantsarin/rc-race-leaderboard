import { Driver } from '@/types/racing';
import { formatTime } from '@/utils/points';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardTableProps {
  drivers: Driver[];
  onEditDriver: (driver: Driver) => void;
  onDeleteDriver: (id: string) => void;
}

export function LeaderboardTable({ drivers, onEditDriver, onDeleteDriver }: LeaderboardTableProps) {
  const getPositionIcon = (position: number) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-racing-gold" />;
    if (position === 2) return <Medal className="h-5 w-5 text-racing-silver" />;
    if (position === 3) return <Award className="h-5 w-5 text-yellow-600" />;
    return null;
  };

  const getPositionStyle = (position: number) => {
    if (position === 1) return "bg-gradient-to-r from-racing-gold/20 to-racing-gold/10 border-racing-gold/30";
    if (position === 2) return "bg-gradient-to-r from-racing-silver/20 to-racing-silver/10 border-racing-silver/30";
    if (position === 3) return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300";
    return "bg-gradient-card border-border";
  };

  // Find fastest lap of the day
  const fastestLapOfDay = Math.min(
    ...drivers
      .filter(d => d.fastestLap && d.fastestLap > 0)
      .map(d => d.fastestLap!)
  );

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-lg border shadow-card lg:block">
        <div className="bg-gradient-racing text-white">
          <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium">
            <div className="col-span-1">Pos</div>
            <div className="col-span-2">Driver</div>
            <div className="col-span-1">Qual</div>
            <div className="col-span-2">Sprint Race</div>
            <div className="col-span-2">Feature Race</div>
            <div className="col-span-1">Fastest</div>
            <div className="col-span-1">Points</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>
        
        <div className="divide-y divide-border bg-background">
          {drivers.map((driver, index) => (
            <div
              key={driver.id}
              className={`grid grid-cols-12 gap-4 p-4 text-sm transition-colors hover:bg-muted/50 ${
                index < 3 ? getPositionStyle(index + 1) : ''
              }`}
            >
              <div className="col-span-1 flex items-center gap-2 font-bold">
                {getPositionIcon(index + 1)}
                {index + 1}
              </div>
              
              <div className="col-span-2 font-medium">{driver.name}</div>
              
              <div className="col-span-1 font-mono text-muted-foreground">
                {driver.qualifyingTime ? formatTime(driver.qualifyingTime) : '--'}
              </div>
              
              <div className="col-span-2">
                <div className="font-mono">
                  {driver.sprintRace.laps > 0 
                    ? `${driver.sprintRace.laps} laps - ${formatTime(driver.sprintRace.totalTime)}`
                    : 'No data'
                  }
                </div>
                {driver.sprintRace.position && (
                  <div className="text-xs text-muted-foreground">P{driver.sprintRace.position}</div>
                )}
              </div>
              
              <div className="col-span-2">
                <div className="font-mono">
                  {driver.featureRace.laps > 0 
                    ? `${driver.featureRace.laps} laps - ${formatTime(driver.featureRace.totalTime)}`
                    : 'No data'
                  }
                </div>
                {driver.featureRace.position && (
                  <div className="text-xs text-muted-foreground">P{driver.featureRace.position}</div>
                )}
              </div>
              
              <div className={`col-span-1 font-mono ${
                driver.fastestLap === fastestLapOfDay && fastestLapOfDay !== Infinity
                  ? 'font-bold text-racing-green'
                  : 'text-muted-foreground'
              }`}>
                {driver.fastestLap ? formatTime(driver.fastestLap) : '--'}
                {driver.fastestLap === fastestLapOfDay && fastestLapOfDay !== Infinity && (
                  <div className="text-xs">+1pt</div>
                )}
              </div>
              
              <div className="col-span-1 text-lg font-bold text-racing-green">
                {driver.totalPoints}
              </div>
              
              <div className="col-span-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditDriver(driver)}
                  className="hover:bg-racing-green hover:text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDeleteDriver(driver.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {drivers.map((driver, index) => (
          <Card key={driver.id} className={`${getPositionStyle(index + 1)} shadow-card`}>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getPositionIcon(index + 1)}
                    <span className="text-2xl font-bold">#{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{driver.name}</h3>
                </div>
                <div className="text-2xl font-bold text-racing-green">
                  {driver.totalPoints} pts
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Qualifying</div>
                  <div className="font-mono">
                    {driver.qualifyingTime ? formatTime(driver.qualifyingTime) : '--'}
                  </div>
                </div>
                
                <div>
                  <div className="text-muted-foreground">Fastest Lap</div>
                  <div className={`font-mono ${
                    driver.fastestLap === fastestLapOfDay && fastestLapOfDay !== Infinity
                      ? 'font-bold text-racing-green'
                      : ''
                  }`}>
                    {driver.fastestLap ? formatTime(driver.fastestLap) : '--'}
                    {driver.fastestLap === fastestLapOfDay && fastestLapOfDay !== Infinity && ' (+1)'}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 border-t pt-3">
                <div>
                  <div className="text-muted-foreground">Sprint Race</div>
                  <div className="font-mono text-sm">
                    {driver.sprintRace.laps > 0 
                      ? `${driver.sprintRace.laps} laps`
                      : 'No data'
                    }
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {driver.sprintRace.totalTime > 0 && formatTime(driver.sprintRace.totalTime)}
                  </div>
                  {driver.sprintRace.position && (
                    <div className="text-xs font-medium">Position: {driver.sprintRace.position}</div>
                  )}
                </div>

                <div>
                  <div className="text-muted-foreground">Feature Race</div>
                  <div className="font-mono text-sm">
                    {driver.featureRace.laps > 0 
                      ? `${driver.featureRace.laps} laps`
                      : 'No data'
                    }
                  </div>
                  <div className="font-mono text-xs text-muted-foreground">
                    {driver.featureRace.totalTime > 0 && formatTime(driver.featureRace.totalTime)}
                  </div>
                  {driver.featureRace.position && (
                    <div className="text-xs font-medium">Position: {driver.featureRace.position}</div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEditDriver(driver)}
                  className="flex-1 hover:bg-racing-green hover:text-white"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onDeleteDriver(driver.id)}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}