class GodGameExtensionControllerBase {
    log(level, prefix, message, details) {
        if (details !== undefined) {
            console[level](prefix, message, details);
            return;
        }

        console[level](prefix, message);
    }

    info(prefix, message, details) {
        this.log('info', prefix, message, details);
    }

    warn(prefix, message, details) {
        this.log('warn', prefix, message, details);
    }

    error(prefix, message, details) {
        this.log('error', prefix, message, details);
    }
}

window.GodGameExtensionControllerBase = GodGameExtensionControllerBase;
