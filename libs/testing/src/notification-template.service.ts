import { faker } from '@faker-js/faker';
import { ChannelCTATypeEnum, ChannelTypeEnum } from '@novu/shared';
import {
  MessageTemplateRepository,
  NotificationGroupRepository,
  NotificationStepEntity,
  NotificationTemplateEntity,
  NotificationTemplateRepository,
} from '@novu/dal';
import { CreateTemplatePayload } from './create-notification-template.interface';

export class NotificationTemplateService {
  constructor(private userId: string, private organizationId: string | undefined, private environmentId: string) {}

  private notificationTemplateRepository = new NotificationTemplateRepository();

  private notificationGroupRepository = new NotificationGroupRepository();

  private messageTemplateRepository = new MessageTemplateRepository();

  async createTemplate(override: Partial<CreateTemplatePayload> = {}) {
    const groups = await this.notificationGroupRepository.find({
      _environmentId: this.environmentId,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const steps: any[] = override?.steps ?? [
      {
        type: ChannelTypeEnum.IN_APP,
        content: 'Test content for <b>{{firstName}}</b>',
        cta: {
          type: ChannelCTATypeEnum.REDIRECT,
          data: {
            url: '/cypress/test-shell/example/test?test-param=true',
          },
        },
      },
      {
        type: ChannelTypeEnum.EMAIL,
        subject: 'Password reset',
        content: [
          {
            type: 'text',
            content: 'This are the text contents of the template for {{firstName}}',
          },
          {
            type: 'button',
            content: 'SIGN UP',
            url: 'https://url-of-app.com/{{urlVariable}}',
          },
        ],
      },
    ];

    const templateSteps: NotificationStepEntity[] = [];

    for (const message of steps) {
      const saved = await this.messageTemplateRepository.create({
        type: message.type,
        cta: message.cta,
        content: message.content,
        subject: message.subject,
        name: message.name,
        _creatorId: this.userId,
        _organizationId: this.organizationId,
        _environmentId: this.environmentId,
      });

      templateSteps.push({
        filters: message.filters,
        _templateId: saved._id,
        active: message.active,
        metadata: message.metadata,
      });
    }

    const data = {
      _notificationGroupId: groups[0]._id,
      _environmentId: this.environmentId,
      name: faker.name.title(),
      _organizationId: this.organizationId,
      _creatorId: this.userId,
      active: true,
      draft: false,
      tags: ['test-tag'],
      description: faker.commerce.productDescription().slice(0, 90),
      triggers: [
        {
          identifier: faker.datatype.uuid(),
          type: 'event',
          variables: [{ name: 'firstName' }, { name: 'lastName' }, { name: 'urlVariable' }],
        },
      ],
      ...override,
      steps: templateSteps,
    };

    const notificationTemplate = await this.notificationTemplateRepository.create(
      data as Partial<NotificationTemplateEntity>
    );

    return await this.notificationTemplateRepository.findById(
      notificationTemplate._id,
      notificationTemplate._organizationId
    );
  }
}
