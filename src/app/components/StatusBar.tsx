import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface StatusItem {
  label: string;
  value: number;
  total: number;
  color: string;
}

interface StatusBarProps {
  title: string;
  items: StatusItem[];
}

export function StatusBar({ title, items }: StatusBarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value} / {item.total}</span>
            </div>
            <Progress 
              value={(item.value / item.total) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
