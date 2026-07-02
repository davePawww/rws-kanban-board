import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { request } from '@/util/graphql';
import { BOARDS_QUERY } from '@/graphql/queries';
import { queryKeys } from '@/graphql/queryKeys';

type Board = {
  id: string;
  title: string;
};

export default function BoardSelect() {
  const { data } = useQuery({
    queryKey: queryKeys.boards,
    queryFn: () => request<{ boards: Board[] }>(BOARDS_QUERY),
  });

  if (!data) return null;

  return (
    <Select defaultValue={data.boards[0]?.id}>
      <SelectTrigger className="border-none text-xs">
        <div className="-space-y-1">
          <h1 className="scroll-m-20 text-base font-semibold tracking-tight text-white">rws-kanban-board</h1>
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectGroup>
        <SelectContent position="popper">
          {data.boards.map((board) => (
            <SelectItem key={board.id} value={board.id}>
              {board.title}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectGroup>
    </Select>
  );
}
