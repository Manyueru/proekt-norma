"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LogIn, LogOut, Save, UserRound } from "lucide-react";
import { topics } from "@/lib/data";
import { TRACK_LABELS, type Track } from "@/lib/types";
import { getCurrentTopic, getOverallProgress, getTrackProgress } from "@/lib/progress";
import { useAuth } from "@/components/providers/auth-provider";
import { usePersonalData } from "@/components/providers/personal-data-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { ProgressBar } from "@/components/shared/progress-bar";

export function AccountDashboard() {
  const { user, profile, signOut, updateProfile, configured } = useAuth();
  const { progress, notes, caseAnswers, testAttempts, studyTasks, exams, storageMode } = usePersonalData();
  const [name, setName] = useState(profile?.displayName || "");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(profile?.displayName || "");
  }, [profile?.displayName]);
  const current = getCurrentTopic(topics, progress);
  const overall = getOverallProgress(topics, progress);
  const tracks = Object.keys(TRACK_LABELS) as Track[];
  const solvedCases = Object.values(caseAnswers).filter((answer) => answer.status === "solved").length;
  const bestTests = useMemo(() => {
    const byQuiz = new Map<string, number>();
    testAttempts.forEach((attempt) => {
      const percent = attempt.total ? Math.round((attempt.score / attempt.total) * 100) : 0;
      byQuiz.set(attempt.quizId, Math.max(byQuiz.get(attempt.quizId) ?? 0, percent));
    });
    return Array.from(byQuiz.values());
  }, [testAttempts]);

  if (!user && configured) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-medium">Личный кабинет</h1>
          <p className="mt-1 text-sm text-muted-c">Здесь будет храниться ваш прогресс, конспекты и результаты.</p>
        </div>
        <Card className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-accent-blue/10 p-3 text-accent-blue"><UserRound size={22} /></div>
            <div>
              <h2 className="text-base font-medium">Войдите в аккаунт</h2>
              <p className="mt-1 text-sm leading-6 text-muted-c">
                После входа данные будут синхронизироваться между компьютером и телефоном.
              </p>
            </div>
          </div>
          {!configured && (
            <p className="rounded-lg bg-accent-violet/10 p-3 text-sm text-muted-c">
              Подключение аккаунтов ещё не настроено. До этого момента сайт продолжит работать локально в текущем браузере.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Link href="/auth/login"><Button variant="primary"><LogIn size={16} />Войти</Button></Link>
            <Link href="/auth/register"><Button>Создать аккаунт</Button></Link>
          </div>
        </Card>
      </div>
    );
  }

  async function saveName() {
    const result = await updateProfile(name);
    setMessage(result.error ? result.error.message : "Имя сохранено.");
  }

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-medium">Личный кабинет</h1>
          <p className="mt-1 text-sm text-muted-c">
            {storageMode === "cloud" ? "Данные синхронизируются с аккаунтом." : "Сейчас используются локальные данные браузера."}
          </p>
        </div>
        {user && <Button variant="ghost" onClick={() => void signOut()}><LogOut size={16} />Выйти</Button>}
      </div>

      {user ? (
        <Card className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <FormField label="Имя в профиле" hint="Используется только для приветствия в личном кабинете.">
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </FormField>
          <Button variant="primary" onClick={() => void saveName()}><Save size={16} />Сохранить</Button>
          {message && <p className="text-xs text-muted-c sm:col-span-2" role="status">{message}</p>}
        </Card>
      ) : (
        <Card className="flex items-start gap-3 border-accent-violet/20 bg-accent-violet/5">
          <div className="rounded-full bg-accent-violet/10 p-3 text-accent-violet"><UserRound size={22} /></div>
          <div>
            <h2 className="text-base font-medium">Локальный личный кабинет</h2>
            <p className="mt-1 text-sm leading-6 text-muted-c">Прогресс, дедлайны и экзамены работают без регистрации, но пока сохраняются только в этом браузере. Синхронизацию подключим после выбора сервиса, стабильно доступного в России.</p>
          </div>
        </Card>
      )}

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="p-4"><p className="text-xs text-muted-c">Общий прогресс</p><p className="mt-1 text-2xl font-medium">{overall}%</p><div className="mt-2"><ProgressBar value={overall} /></div></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">Конспекты</p><p className="mt-1 text-2xl font-medium">{notes.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">Решённые задачи</p><p className="mt-1 text-2xl font-medium">{solvedCases}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">Пройденные тесты</p><p className="mt-1 text-2xl font-medium">{bestTests.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">Активные дедлайны</p><p className="mt-1 text-2xl font-medium">{studyTasks.filter((task) => task.status !== "completed").length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-c">Экзамены</p><p className="mt-1 text-2xl font-medium">{exams.length}</p></Card>
      </section>

      {current && (
        <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="text-xs text-muted-c">Продолжить</p><p className="mt-1 text-sm font-medium">{current.title}</p></div>
          <Link href={`/modules/${current.slug}`}><Button variant="primary">Открыть тему</Button></Link>
        </Card>
      )}

      <section>
        <h2 className="mb-3 text-sm font-medium">Прогресс по направлениям</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {tracks.map((track) => {
            const info = getTrackProgress(topics, progress, track);
            if (!info.total) return null;
            return (
              <Card key={track} className="p-4">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium">{TRACK_LABELS[track]}</p><span className="text-xs text-muted-c">{info.mastered} из {info.total}</span></div>
                <div className="mt-3"><ProgressBar value={info.percent} /></div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div><h2 className="mb-3 text-sm font-medium">Последние конспекты</h2><div className="flex flex-col gap-2">{notes.slice(0,4).map((note)=><Link key={note.id} href={`/notes?note=${note.id}`} className="rounded-lg border border-c px-4 py-3 hover:border-accent-blue/40"><p className="text-sm font-medium">{note.title}</p><p className="mt-1 text-xs text-muted-c">{new Date(note.updatedAt).toLocaleDateString("ru-RU")}</p></Link>)}{!notes.length&&<p className="text-sm text-muted-c">Пока нет конспектов.</p>}</div></div>
        <div><h2 className="mb-3 text-sm font-medium">Лучшие результаты тестов</h2><div className="flex flex-col gap-2">{bestTests.slice(0,4).map((score,index)=><div key={`${score}-${index}`} className="rounded-lg border border-c px-4 py-3 text-sm">Результат: <span className="font-medium">{score}%</span></div>)}{!bestTests.length&&<p className="text-sm text-muted-c">Пока нет пройденных тестов.</p>}</div></div>
      </section>
    </div>
  );
}
