function FieldErrors(props: { errors: string | Array<any> | object }) {
    let errorElements: React.ReactNode[] = [];

    if (typeof props.errors === "string") {
        if (props.errors.length > 0) {
            errorElements.push(
                <li
                    key="error-string"
                    className="text-left ml-6 text-white"
                >
                    {props.errors}
                </li>
            );
        }
    } else if (Array.isArray(props.errors)) {
        const stringErrors = props.errors.filter((err: any) => typeof err === "string");
        errorElements = stringErrors.map((err: string, idx: number) => (
            <li
                key={idx}
                className="text-left ml-6 text-white"
            >
                {err}
            </li>
        ));
    } else if (props.errors && typeof props.errors === "object") {
        const entries = Object.entries(props.errors);
        for (let i = 0; i < entries.length; i++) {
            const [key, value] = entries[i];
            const showHeader = key !== "__all__";
            let header = showHeader ? (
                <h4 className="font-medium text-white">{key}:</h4>
            ) : null;

            if (typeof value === "string") {
                errorElements.push(
                    <li key={key} className="text-left ml-6 text-white">
                        {header}
                        {value}
                    </li>
                );
            } else if (Array.isArray(value)) {
                // Only render string elements in the array
                const stringItems = [];
                for (let j = 0; j < value.length; j++) {
                    if (typeof value[j] === "string") {
                        stringItems.push(value[j]);
                    }
                }
                if (stringItems.length > 0) {
                    errorElements.push(
                        <li key={key} className="text-left ml-6 text-white">
                            {header}
                            <ul className="list-disc">
                                {stringItems.map((item, idx) => (
                                    <li key={idx} className="text-left ml-6 text-white">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    );
                }
            }
        }
    }

    if (!errorElements.length) {
        return null;
    }

    return (
        <output
            name="error"
            aria-label="Error message"
            className="flex flex-col bg-red-800 rounded-2xl p-4"
        >
            <h3 className="font-bold text-white">Errors:</h3>
            <ul className="list-disc text-left">
                {errorElements}
            </ul>
        </output>
    );
}

export default FieldErrors;