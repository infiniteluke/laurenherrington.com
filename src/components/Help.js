import React from 'react';
import Portal from '@reach/portal';
import VisuallyHidden from '@reach/visually-hidden';
import { useRect } from '@reach/rect';

const Help = React.forwardRef(function Help(
  {
    // The component you want to provide "Help" for
    children,
    // The HelpContent to render
    render = () => {
      throw new Error(
        'You must provide a render prop that renders the Help content'
      );
    },
    ariaLabel,
    mobileMediaQuery = '(max-width: 412px)',
    position = positionDefault,
    localStorageNameSpace = 'help',
    helpName = 'tip',
    mobileHelpOnly = true,
    ...rest
  },
  forwardRef
) {
  const [dismissed, setDismiss] = useLocalStorage(
    `${localStorageNameSpace}:${helpName}:dismissed`,
    false
  );
  const [actionCompleted, setActionCompleted] = React.useState(false);
  const match = React.useRef(window.matchMedia(mobileMediaQuery));
  const [isMobile, setIsMobile] = React.useState(match.current.matches);
  React.useEffect(() => {
    if (mobileHelpOnly) {
      const mediaMatch = match.current;
      const listener = e => {
        setIsMobile(e.matches);
      };
      mediaMatch.addListener(listener);
      return () => {
        mediaMatch.removeListener(listener);
      };
    }
  }, [mobileHelpOnly, isMobile, match]);

  const helping =
    // Don't show help if it's been dismissed
    !dismissed &&
    // If only mobile should see help,
    // use media queries or userAgent to decide whether to show help
    (mobileHelpOnly &&
      (isMobile ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )));
  // Ref for help
  const triggerRef = React.useRef();
  const triggerRect = useRect(triggerRef, helping);

  const dismiss = () => {
    setDismiss(true);
  };
  const completeAction = () => {
    setActionCompleted(true);
  };

  return (
    <React.Fragment>
      {/* Clone the children we're providing help for and pass some "helpful" props to them */}
      {React.cloneElement(React.Children.only(children), {
        ref: triggerRef,
        completeAction,
        helping,
      })}
      {helping && (
        <Portal>
          <HelpContent
            ariaLabel={ariaLabel}
            position={position}
            helping={helping}
            id={helpName}
            triggerRect={triggerRect}
            ref={forwardRef}
            {...rest}
          >
            {render({ dismiss, actionCompleted })}
          </HelpContent>
        </Portal>
      )}
    </React.Fragment>
  );
});

const OFFSET = 12;

const getStyles = (position, triggerRect, tooltipRect) => {
  const haventMeasuredTooltipYet = !tooltipRect;
  if (haventMeasuredTooltipYet) {
    return { visibility: 'hidden' };
  }
  return position(triggerRect, tooltipRect);
};

const positionDefault = (triggerRect, tooltipRect) => {
  const styles = {
    left: `${triggerRect.left + window.scrollX}px`,
    top: `${triggerRect.top + triggerRect.height + window.scrollY}px`,
  };

  const collisions = {
    top: triggerRect.top - tooltipRect.height < 0,
    right: window.innerWidth < triggerRect.left + tooltipRect.width,
    bottom:
      window.innerHeight < triggerRect.bottom + tooltipRect.height + OFFSET,
    left: triggerRect.left - tooltipRect.width < 0,
  };

  const directionRight = collisions.right && !collisions.left;
  const directionUp = collisions.bottom && !collisions.top;

  return {
    ...styles,
    left: directionRight
      ? `${triggerRect.right - tooltipRect.width + window.scrollX}px`
      : `${triggerRect.left + window.scrollX}px`,
    top: directionUp
      ? `${triggerRect.top - OFFSET - tooltipRect.height + window.scrollY}px`
      : `${triggerRect.top + OFFSET + triggerRect.height + window.scrollY}px`,
  };
};

const HelpContent = React.forwardRef(function HelpContent(
  {
    children,
    dismiss,
    ariaLabel,
    position,
    helping,
    id,
    triggerRect,
    style,
    ...rest
  },
  forwardRef
) {
  const useAriaLabel = ariaLabel != null;
  const tooltipRef = React.useRef();
  const tooltipRect = useRect(tooltipRef, helping);

  return (
    <React.Fragment>
      <div
        data-help
        role={useAriaLabel ? undefined : 'tooltip'}
        id={useAriaLabel ? undefined : id}
        style={{
          ...style,
          ...getStyles(position, triggerRect, tooltipRect),
        }}
        ref={node => {
          tooltipRef.current = node;
          if (forwardRef) forwardRef(node);
        }}
        {...rest}
      >
        {children}
      </div>
      {useAriaLabel && (
        <VisuallyHidden role="tooltip" id={id}>
          {ariaLabel}
        </VisuallyHidden>
      )}
    </React.Fragment>
  );
});

function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default Help;
