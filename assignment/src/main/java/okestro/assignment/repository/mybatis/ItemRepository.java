package okestro.assignment.repository.mybatis;

import lombok.RequiredArgsConstructor;
import okestro.assignment.domain.Item;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ItemRepository {

    private final ItemMapper itemMapper;

    public Item save(Item item){
        itemMapper.save(item);
        return item;
    }

}
