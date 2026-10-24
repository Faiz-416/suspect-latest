import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucidePlus, LucideX, LucideHash, LucidePlay, LucidePause, LucideRefreshCcw, LucideCheck, LucideMinus, LucideTimer, LucideUsers, LucideArrowRight, LucideInfo, LucideLock, LucideSearch, LucidePalette } from 'lucide-react';
import { AppScreen, GameMode, GameState, Player, CATEGORIES } from './types';
import { setupGame1, setupGame2, getRandomQuestion, getRandomWordPair } from './services/gameLogic';
import { Button, Card, Heading, SubHeading, ScreenContainer, Input, ConfirmationModal, InfoModal, DrawingCanvas } from './components/UI';
import { ANIMATION_DURATION } from './constants';

const formatName = (s: string) => s.trim().charAt(0).toUpperCase() + s.trim().slice(1);

const App = () => {
  const [state, setState] = useState<GameState>({
    screen: AppScreen.HOME, players: [], activeGame: null, imposterCount: 1, category: "Food", currentPlayerIndex: 0,
    questionSafe: '', questionImpostor: '', wordSafe: '', wordImpostor: '', canvasData: null, timeLeft: 0, roundDuration: 120, isTimerRunning: false, votes: {}
  });

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    let interval: any;
    if (state.isTimerRunning && state.timeLeft > 0) {
      interval = setInterval(() => setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 })), 1000);
    }
    return () => clearInterval(interval);
  }, [state.isTimerRunning, state.timeLeft]);

  const addPlayer = (name: string) => {
    if (!name.trim() || state.players.some(p => p.name === formatName(name))) return;
    setState(prev => ({ ...prev, players: [...prev.players, { id: crypto.randomUUID(), name: formatName(name), avatarSeed: 0, isImpostor: false, score: 0 }] }));
  };

  const proceedToGameSetup = () => {
    if (state.activeGame === GameMode.NUMBER_JUSTIFY) {
      const q = getRandomQuestion();
      setState(prev => ({ ...prev, players: setupGame1(prev.players, prev.imposterCount), questionSafe: q.safe, questionImpostor: q.impostor, currentPlayerIndex: 0, screen: AppScreen.G1_ASSIGNMENT }));
    } else { setState(prev => ({ ...prev, screen: AppScreen.G2_CATEGORY_SELECT })); }
  };

  const selectCategory = (cat: string) => {
    const w = getRandomWordPair(cat);
    const updatedPlayers = setupGame2(state.players, state.imposterCount);
    setState(prev => ({ ...prev, category: cat, players: updatedPlayers, wordSafe: w.safe, wordImpostor: state.activeGame === GameMode.SKETCHY_SUSPECT ? cat : w.impostor, currentPlayerIndex: 0, screen: AppScreen.G2_REVEAL_FLOW }));
  };

  const handleBack = () => state.screen === AppScreen.HOME ? null : (state.screen === AppScreen.PLAYER_SETUP ? setState(p => ({ ...p, screen: AppScreen.HOME })) : setShowExitConfirm(true));

  return (
    <ScreenContainer onBack={state.screen !== AppScreen.HOME ? handleBack : undefined}>
        <ConfirmationModal isOpen={showExitConfirm} title="Quit Game?" message="Your progress will be lost." onConfirm={() => {setShowExitConfirm(false); setState(p=>({...p, screen: AppScreen.HOME}))}} onCancel={() => setShowExitConfirm(false)} />
        <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
        
        <AnimatePresence mode='wait'>
            <motion.div key={state.screen} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full w-full">
                {state.screen === AppScreen.HOME && (
                  <div className="flex flex-col gap-4 justify-center h-full">
                    <Heading className="text-center mb-8">Select Game</Heading>
                    <Card onClick={() => setState(p=>({...p, activeGame: GameMode.NUMBER_JUSTIFY, screen: AppScreen.PLAYER_SETUP}))} className="border-l-4 border-[#7C5CFF]"><h3 className="text-xl font-bold">Number Justify</h3><p className="text-sm text-[#B3B3C6]">Find the liar with numbers.</p></Card>
                    <Card onClick={() => setState(p=>({...p, activeGame: GameMode.IMPOSTOR_WORD, screen: AppScreen.PLAYER_SETUP}))} className="border-l-4 border-[#4CC9F0]"><h3 className="text-xl font-bold">Impostor Word</h3><p className="text-sm text-[#B3B3C6]">Find the different word.</p></Card>
                    <Card onClick={() => setState(p=>({...p, activeGame: GameMode.SKETCHY_SUSPECT, screen: AppScreen.PLAYER_SETUP}))} className="border-l-4 border-[#FF5C8E]"><h3 className="text-xl font-bold">Sketchy Suspect</h3><p className="text-sm text-[#B3B3C6]">Draw to find the suspect.</p></Card>
                  </div>
                )}

                {state.screen === AppScreen.PLAYER_SETUP && (
                  <div className="flex flex-col h-full pt-16">
                    <Heading>Add Players</Heading>
                    <div className="flex gap-2 mb-6"><Input placeholder="Name..." onKeyDown={(e:any) => { if(e.key==='Enter'){ addPlayer(e.target.value); e.target.value=''; } }} /></div>
                    <div className="flex-1 overflow-y-auto flex flex-wrap gap-2">{state.players.map(p => <div key={p.id} className="bg-[#1A1A22] px-4 py-2 rounded-full flex items-center gap-2 border border-white/5">{p.name}<LucideX size={14} onClick={()=>setState(prev=>({...prev, players:prev.players.filter(pl=>pl.id!==p.id)}))} /></div>)}</div>
                    <Button disabled={state.players.length < 3} onClick={proceedToGameSetup}>Start Game</Button>
                  </div>
                )}

                {state.screen === AppScreen.G2_REVEAL_FLOW && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <SubHeading>Pass phone to</SubHeading><Heading className="text-5xl mb-12">{state.players[state.currentPlayerIndex].name}</Heading>
                    <Card className="mb-8 py-10 bg-[#1A1A22] border-2 border-[#7C5CFF]/20">
                      <p className="text-[#B3B3C6] text-xs font-bold uppercase mb-4">Your Secret</p>
                      <p className="text-3xl font-black">{state.players[state.currentPlayerIndex].isImpostor ? (state.activeGame === GameMode.SKETCHY_SUSPECT ? `Category: ${state.category}` : state.wordImpostor) : state.wordSafe}</p>
                    </Card>
                    <Button onClick={() => {
                      const isLast = state.currentPlayerIndex === state.players.length - 1;
                      if (isLast) setState(p=>({...p, screen: p.activeGame === GameMode.SKETCHY_SUSPECT ? AppScreen.G3_DRAW : AppScreen.G2_GAMEPLAY, timeLeft: p.roundDuration, isTimerRunning: true }));
                      else setState(p=>({...p, currentPlayerIndex: p.currentPlayerIndex + 1}));
                    }}>Next Player</Button>
                  </div>
                )}

                {state.screen === AppScreen.G3_DRAW && (
                  <div className="h-full flex flex-col pt-12"><Heading className="text-center">Sketchy Canvas</Heading><DrawingCanvas label={state.category} onSave={(data)=>setState(p=>({...p, canvasData: data, screen: AppScreen.G3_DISCUSS}))} /></div>
                )}

                {(state.screen === AppScreen.G2_GAMEPLAY || state.screen === AppScreen.G3_DISCUSS) && (
                  <div className="h-full flex flex-col pt-16">
                    <Heading className="text-center">Discuss!</Heading>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      {state.canvasData && <img src={state.canvasData} className="w-full max-h-[300px] object-contain rounded-2xl border border-white/10 mb-4" />}
                      <div className="text-7xl font-mono">{Math.floor(state.timeLeft / 60)}:{(state.timeLeft % 60).toString().padStart(2, '0')}</div>
                    </div>
                    <Button onClick={()=>setState(p=>({...p, screen: AppScreen.G2_VOTE}))}>Vote Now</Button>
                  </div>
                )}

                {state.screen === AppScreen.G2_VOTE && (
                  <div className="h-full flex flex-col pt-16">
                    <Heading className="text-center">Who is Suspect?</Heading>
                    <div className="grid grid-cols-2 gap-2 mt-8">{state.players.map(p => <Card key={p.id} onClick={()=>setState(prev=>({...prev, votes: {'GROUP': p.id}}))} className={state.votes['GROUP'] === p.id ? 'border-2 border-[#E5484D]' : ''}>{p.name}</Card>)}</div>
                    <Button className="mt-auto" onClick={()=>setState(p=>({...p, screen: AppScreen.G2_RESULTS}))}>Reveal Result</Button>
                  </div>
                )}

                {state.screen === AppScreen.G2_RESULTS && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <Heading className="text-6xl">{state.players.find(p=>p.id===state.votes['GROUP'])?.isImpostor ? "CAUGHT!" : "ESCAPED!"}</Heading>
                    <SubHeading className="mt-4">The Impostor was: {state.players.find(p=>p.isImpostor)?.name}</SubHeading>
                    <Button className="mt-12" onClick={()=>setState(p=>({...p, screen: AppScreen.HOME, votes:{}}))}>Main Menu</Button>
                  </div>
                )}
            </motion.div>
        </AnimatePresence>
    </ScreenContainer>
  );
};

export default App;