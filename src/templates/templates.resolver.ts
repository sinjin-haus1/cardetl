import { Resolver, Query, Args } from '@nestjs/graphql';
import { TemplatesService } from './templates.service';
import { Template } from './schemas/template.schema';

@Resolver(() => Template)
export class TemplatesResolver {
  constructor(private readonly templatesService: TemplatesService) {}

  @Query(() => [Template])
  async templates(): Promise<Template[]> {
    return this.templatesService.findAll();
  }

  @Query(() => Template, { nullable: true })
  async template(@Args('slug') slug: string): Promise<Template> {
    return this.templatesService.findBySlug(slug);
  }
}
