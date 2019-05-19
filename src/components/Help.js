import React from 'react';
import Portal from '@reach/portal';
import VisuallyHidden from '@reach/visually-hidden';
import { useRect } from '@reach/rect';

const Help = React.forwardRef(function Help(
  {
    // The component you want to provide "Help" for
    children,
    // The HelpContent to render in the popup
    render = () => {
      throw new Error(
        'You must provide a render prop that renders the Help content'
      );
    },
    ariaLabel,
    position = positionDefault,
    localStorageNameSpace = 'help',
    helpName = 'tip',
    actionCompletedTimeout = 1000,
    ...rest
  },
  forwardRef
) {
  const [dismissed, setDismiss] = useLocalStorage(
    `${localStorageNameSpace}:${helpName}:dismissed`,
    false
  );
  const [actionCompleted, setActionCompleted] = React.useState(false);
  const completeAction = () => {
    setActionCompleted(true);
  };
  const dismiss = React.useCallback(() => {
    setDismiss(true);
  }, [setDismiss]);
  React.useEffect(() => {
    if (actionCompleted) {
      const timer = setTimeout(() => {
        dismiss();
      }, actionCompletedTimeout);
      return () => clearTimeout(timer);
    }
  }, [actionCompleted, actionCompletedTimeout, dismiss]);

  // Don't show help if it's been dismissed
  const helping = !dismissed;
  // Ref for help
  const triggerRef = React.useRef();
  const triggerRect = useRect(triggerRef, helping);
  // Because the portal is only rendered when helping,
  // we need to unconditionally render the help children so any
  // hooks inside it will be executed.
  const helpChildren = render({ dismiss, actionCompleted });

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
            {helpChildren}
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
