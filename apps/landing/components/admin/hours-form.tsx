"use client";

import { useActionState, useState } from "react";

import type { OpeningHour } from "@brasamar/db";
import { Input, cn } from "@brasamar/ui";

import { SaveBar } from "@/components/admin/save-bar";
import { initialFormState } from "@/lib/actions/form-state";
import { saveOpeningHours } from "@/lib/actions/settings";

export function HoursForm({ hours }: { hours: OpeningHour[] }) {
  const [estado, action] = useActionState(saveOpeningHours, initialFormState);

  // Marcar "fechado" precisa desabilitar os horários na hora, senão a pessoa
  // preenche campos que serão descartados.
  const [fechados, setFechados] = useState(
    () => new Set(hours.filter((dia) => dia.closed).map((dia) => dia.weekday)),
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      <ul className="flex flex-col gap-2.5">
        {hours.map((dia) => {
          const fechado = fechados.has(dia.weekday);

          return (
            <li
              key={dia.weekday}
              className={cn(
                "grid items-center gap-3 rounded-md border border-creme/12 px-4 py-3 sm:grid-cols-[110px_1fr_1fr_auto]",
                fechado && "opacity-60",
              )}
            >
              <span className="text-[14.5px] text-creme">{dia.label}</span>
              <input
                type="hidden"
                name={`dia-${dia.weekday}-label`}
                value={dia.label}
              />

              <label className="flex items-center gap-2 text-[12.5px] text-creme/45">
                <span className="w-9">Abre</span>
                <Input
                  name={`dia-${dia.weekday}-abre`}
                  type="time"
                  defaultValue={dia.opensAt}
                  disabled={fechado}
                  className="py-2"
                />
              </label>

              <label className="flex items-center gap-2 text-[12.5px] text-creme/45">
                <span className="w-9">Fecha</span>
                <Input
                  name={`dia-${dia.weekday}-fecha`}
                  type="time"
                  defaultValue={dia.closesAt}
                  disabled={fechado}
                  className="py-2"
                />
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-[13px] text-creme/70">
                <input
                  type="checkbox"
                  name={`dia-${dia.weekday}-fechado`}
                  defaultChecked={dia.closed}
                  onChange={(event) =>
                    setFechados((atual) => {
                      const proximo = new Set(atual);
                      if (event.target.checked) proximo.add(dia.weekday);
                      else proximo.delete(dia.weekday);
                      return proximo;
                    })
                  }
                  className="size-4 accent-brasa-500"
                />
                Fechado
              </label>
            </li>
          );
        })}
      </ul>

      <p className="text-[13px] leading-snug text-creme/40">
        Dias seguidos com o mesmo horário são agrupados sozinhos no site — três
        dias iguais viram “Terça a quinta”.
      </p>

      <SaveBar estado={estado} />
    </form>
  );
}
