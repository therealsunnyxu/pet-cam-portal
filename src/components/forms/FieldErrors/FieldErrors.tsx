import "./FieldErrors.css";

function FieldErrors(props: { errors: string | Array<any> | object }) {
    // Simpler error types: strings and arrays
    if (typeof (props.errors) === "string") {
        return (<p>{props.errors}</p>);
    } else if (props.errors instanceof Array) {
        return (<ul>
            {props.errors
                .filter((err: any) => typeof err === "string")
                .map((err: string, idx: number) => <li key={idx}>{err}</li>)
            }
        </ul>);
    }

    // Process object-based error types
    // Prepare error elements outside the return statement
    let errorElements: React.ReactNode[] = [];
    const entries = Object.entries(props.errors);
    for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        // Shared logic for h4 tag
        const showHeader = key !== "__all__";
        let header = showHeader ? <h4>{key}:</h4> : null;

        if (typeof value === "string") {
            errorElements.push(
                (<li key={key}>{header}{value}</li>)
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
                    <li key={key}>
                        {header}
                        <ul key={key}>
                            {stringItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </li>
                );
            }
        }
    }

    return (
        <output name="error" aria-label="Error message">
            <h3>Errors:</h3>
            <ul>
                {errorElements}
            </ul>
        </output>
    );
}

export default FieldErrors;