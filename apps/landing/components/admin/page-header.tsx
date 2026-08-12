import { Heading, Text } from "@brasamar/ui";

export function PageHeader({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao?: string;
}) {
  return (
    <div className="mb-8">
      <Heading level={2} className="text-[clamp(1.65rem,3vw,2.125rem)]">
        {titulo}
      </Heading>
      {descricao ? (
        <Text muted className="mt-2.5 max-w-[560px] text-[15px]">
          {descricao}
        </Text>
      ) : null}
    </div>
  );
}
