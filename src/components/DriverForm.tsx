import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Driver } from '@/types/racing';
import { formatTime, parseTime } from '@/utils/points';
import { X } from 'lucide-react';

interface DriverFormProps {
  driver?: Driver;
  onSave: (driver: Driver) => void;
  onCancel: () => void;
}

export function DriverForm({ driver, onSave, onCancel }: DriverFormProps) {
  const [formData, setFormData] = useState<Driver>({
    id: driver?.id || crypto.randomUUID(),
    name: driver?.name || '',
    qualifyingTime: driver?.qualifyingTime || 0,
    sprintRace: driver?.sprintRace || { laps: 0, totalTime: 0, position: undefined },
    featureRace: driver?.featureRace || { laps: 0, totalTime: 0, position: undefined },
    fastestLap: driver?.fastestLap || 0,
    totalPoints: driver?.totalPoints || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  return (
    <Card className="fixed inset-4 z-50 mx-auto max-w-4xl overflow-auto bg-gradient-card shadow-racing">
      <CardHeader className="bg-gradient-racing text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">
            {driver ? 'Edit Driver' : 'Add New Driver'}
          </CardTitle>
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            className="bg-white/20 hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">Driver Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              placeholder="Enter driver name"
              required
            />
          </div>

          <div>
            <Label htmlFor="qualifying" className="text-sm font-medium">Qualifying Best Lap (seconds)</Label>
            <Input
              id="qualifying"
              type="number"
              step="0.001"
              value={formData.qualifyingTime || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                qualifyingTime: parseFloat(e.target.value) || 0 
              })}
              className="mt-1 font-mono"
              placeholder="0.000"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Sprint Race */}
            <div className="space-y-4 rounded-lg bg-racing-silver/20 p-4">
              <h3 className="text-lg font-semibold text-racing-green">Sprint Race</h3>
              
              <div>
                <Label className="text-sm font-medium">Laps Completed</Label>
                <Input
                  type="number"
                  value={formData.sprintRace.laps}
                  onChange={(e) => setFormData({
                    ...formData,
                    sprintRace: { ...formData.sprintRace, laps: parseInt(e.target.value) || 0 }
                  })}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Total Time (seconds)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.sprintRace.totalTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    sprintRace: { ...formData.sprintRace, totalTime: parseFloat(e.target.value) || 0 }
                  })}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Position</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.sprintRace.position || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    sprintRace: { ...formData.sprintRace, position: parseInt(e.target.value) || undefined }
                  })}
                  className="mt-1"
                  placeholder="Position (1-8 for points)"
                />
              </div>
            </div>

            {/* Feature Race */}
            <div className="space-y-4 rounded-lg bg-racing-gold/20 p-4">
              <h3 className="text-lg font-semibold text-racing-green">Feature Race</h3>
              
              <div>
                <Label className="text-sm font-medium">Laps Completed</Label>
                <Input
                  type="number"
                  value={formData.featureRace.laps}
                  onChange={(e) => setFormData({
                    ...formData,
                    featureRace: { ...formData.featureRace, laps: parseInt(e.target.value) || 0 }
                  })}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Total Time (seconds)</Label>
                <Input
                  type="number"
                  step="0.001"
                  value={formData.featureRace.totalTime}
                  onChange={(e) => setFormData({
                    ...formData,
                    featureRace: { ...formData.featureRace, totalTime: parseFloat(e.target.value) || 0 }
                  })}
                  className="mt-1 font-mono"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Position</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.featureRace.position || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    featureRace: { ...formData.featureRace, position: parseInt(e.target.value) || undefined }
                  })}
                  className="mt-1"
                  placeholder="Position (1-10 for points)"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="fastestLap" className="text-sm font-medium">Fastest Lap of Day (seconds)</Label>
            <Input
              id="fastestLap"
              type="number"
              step="0.001"
              value={formData.fastestLap || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                fastestLap: parseFloat(e.target.value) || 0 
              })}
              className="mt-1 font-mono"
              placeholder="0.000"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1 bg-gradient-racing hover:opacity-90">
              {driver ? 'Update Driver' : 'Add Driver'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}