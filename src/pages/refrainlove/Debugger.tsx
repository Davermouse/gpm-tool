import { observer } from "mobx-react";
import { useGPMToolContext } from "../../context/GPMToolContext";
import { EventStep, RLEvent, RLEventEngine, RLOperator } from "../../gpm-lib/refrainlove/RefrainLoveImage";
import { useEffect, useState } from "react";

import styles from './Debugger.module.css';

const Step: React.FC<{ step: EventStep, currentStep: boolean }> =
    ({ step, currentStep }) => {

        return (
            <li style={{ color: currentStep ? 'red' : 'inherit'}}>{step instanceof RLOperator ?
                step.name : step}</li>
        );
    };

const Source: React.FC<{ engine: RLEventEngine }> = 
    observer(({ engine } ) => {
    return (
        <div className={styles.source}>
            <ol>
                {engine.e.steps.map((s, i) => <Step key={i} step={s} currentStep={i === engine.pc}/>)}
            </ol>
        </div>
    )
});

const StackEntry: React.FC<{value: number, index: number, engine: RLEventEngine}> =
    ({ value, index, engine }) => {
         if ((value & 0x20000000) == 0) {
            if ((value & 0x40000000) == 0) {
                if (((value & 0x7f000000) == 0x4000000) || 
                    ((value & 0x7f000000) == 0x8000000)) {
                    const s = value & 0xffff;

                    return <li>Short: {s.toString(16)}</li>
                }
            } else {
                return <li>Stack[{value & 0xffff}]</li>
            }
        } else {
            return <li>Globals[{value & 0xffff}]</li>
        }
        
        return <li>
            {value.toString(16)}
        </li>
    }

const Stack: React.FC<{engine: RLEventEngine}> = 
    ({engine}) => {
        return (
            <div className={styles.stack}>
            <ol>
                {engine.stack.filter((_, i) => i <= engine.stack_p).map((e, i) => <StackEntry value={e} index={i} engine={engine} />)}
            </ol>
            </div>
        )
    };

const Graphics: React.FC<{engine: RLEventEngine}> =
    ({engine}) => {
        const labels: Record<number, string| undefined> = {
            0x1a: 'gfx_unk_1',
            0x1b: 'is_mono',
            0x1c: 'volumes',
            0x1d: 'seq_volume'
        };

    return (
        <div className={styles.graphics}>
            <ol>
                {engine.globals.map((g, i) => <li>{labels[i]} - {g.toString(16)}</li>)}
            </ol>
        </div>
    );
};

export const Debugger = observer(() => {
  //  const [event, setEvent] = useState<RLEvent | null>(null);
    const [ee, setEE] = useState<RLEventEngine | null>(null);
    const { fileStore } = useGPMToolContext();

    if (!fileStore) {
        throw new Error('Filestore not loaded');
    }

    if (!fileStore.refrainLoveImage) {
        throw new Error('Missing RefrainLove image');
    }
    useEffect(() => {
        if (fileStore == null || fileStore.refrainLoveImage == null)
            return;

        const initEv = fileStore.refrainLoveImage.loadEvent("_BOOT");

        if (initEv === null) {
            console.error("Unable to find _BOOT event");
            return;
        }

        setEE(new RLEventEngine(initEv));
    }, []);

  //    ee.run();

  if (ee == null) {
    return <p>Loading....</p>
  }

    return (
        <div className={styles.debugger}>
            <div className={styles.controls}>
                <button onClick={() => { ee.step() }}>Step</button>
                <button onClick={() => { ee.run() }}>Run</button>
                <p>PC: {ee.pc}</p></div>
            
            <Source engine={ee} />
            <Stack engine={ee} />
            <Graphics engine={ee} />
        </div>
    )
});