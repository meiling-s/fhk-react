import { useState, useCallback } from "react";

const useOnSubmit = (submit: (e: any) => void) => {
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = useCallback(
        (e: any) => {
          if (!submitted) {
            setSubmitted(true);
            submit(e); // Call the provided submit function
          }
        },
        [submitted, submit]
    );
    return onSubmit;
};

export default useOnSubmit;
