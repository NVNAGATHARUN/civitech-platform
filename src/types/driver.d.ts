declare module 'driver.js' {
    export interface DriveStep {
        element: string | HTMLElement;
        popover?: {
            title?: string;
            description?: string;
            side?: 'left' | 'top' | 'right' | 'bottom';
            align?: 'start' | 'center' | 'end';
        };
    }

    export interface Config {
        showProgress?: boolean;
        animate?: boolean;
        steps?: DriveStep[];
        onDestroyStarted?: () => void;
    }

    export interface Driver {
        drive: (stepIndex?: number) => void;
        moveNext: () => void;
        movePrevious: () => void;
        hasNextStep: () => boolean;
        hasPreviousStep: () => boolean;
        destroy: () => void;
    }

    export function driver(config?: Config): Driver;
}
