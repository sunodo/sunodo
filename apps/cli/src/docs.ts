import { Help, toConfiguredId, toStandardizedId } from "@oclif/core";

export default class DocsHelp extends Help {
    public rootData() {
        return {
            bin: this.config.bin,
            binAliases: this.config.binAliases,
            binPath: this.config.binPath,
            version: this.config.version,
            formatted: this.formatRoot(),
        };
    }

    public completeData() {
        return {
            ...this.rootData(),
            topics: this.sortedTopics.map((topic) => {
                return {
                    ...topic,
                    formatted: this.formatTopic(topic),
                };
            }),
            commands: this.sortedCommands.map((command) => {
                return {
                    ...command,
                    configuredId: toConfiguredId(command.id, this.config),
                    standardizedId: toStandardizedId(command.id, this.config),
                    formatted: this.formatCommand(command),
                };
            }),
        };
    }

    public commandData(id: string) {
        const command = this.config.findCommand(id);
        return {
            ...this.rootData(),
            command: {
                ...command,
                configuredId: toConfiguredId(id, this.config),
                standardizedId: toStandardizedId(id, this.config),
                formatted: command ? this.formatCommand(command) : undefined,
            },
        };
    }

    public topicData(id: string) {
        const topic = this.config.findTopic(id);
        return {
            ...this.rootData(),
            topic: {
                ...topic,
                formatted: topic ? this.formatTopic(topic) : undefined,
            },
        };
    }
}
