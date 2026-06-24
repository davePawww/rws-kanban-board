import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BoardSelect() {
  return (
    <Select defaultValue="Board 1">
      <SelectTrigger className="border-none text-xs">
        <div className="-space-y-1">
          <h1 className="text-foreground scroll-m-20 text-base font-semibold tracking-tight">rws-kanban-board</h1>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectGroup>
        <SelectContent position="popper">
          <SelectItem value="Board 1">Board 1</SelectItem>
          <SelectItem value="2">Board 2</SelectItem>
          <SelectItem value="3">Board 3</SelectItem>
        </SelectContent>
      </SelectGroup>
    </Select>
  );
}
